import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Slider,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import HTML from 'react-native-render-html';
import Svg, {Polygon} from 'react-native-svg'

import { getDatabase } from "../../../utils/db";
import fireUtil from '../../../utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;

var SeededShuffle = require('seededshuffle');

export default class LocationChallenges extends Component {
    constructor() {
        super();
    
        this.state = {
          //state needs to be updated when the current question changes and when the completion data changes
          //it should be handled in the exact same manner
          currentQuestionObject: global.huntQuestionData[0],
          currentQuestion: 0, //the current question in view
          questionOptions: null, // the possible options for a multiple choice question
          correctAnswer: null, //the correct answer for the current question view
          questionFinished: false,
          pointsPossible: 100, //is the current question on the screen answered correctly
          feedback: null,
          completionData: null,
          guess: 0,
          fill_in_the_blank_hint: null,
          lightningRoundBonusPoints: 0,
          huntFinished: false,
        }
      }
    
    render() {
    let huntQuestionData = global.huntQuestionData;
    let width = this.props.width

    //defining the header text
    let headerText = ''
    if (huntQuestionData[this.state.currentQuestion].type == "question" ) {headerText = 'LOCATION CHALLENGE' } 
    else if (huntQuestionData[this.state.currentQuestion].type == "fill_in_the_blank" ){  headerText = 'Location Text Challenge' }
    else if (huntQuestionData[this.state.currentQuestion].type == "number_guesser" ){  headerText = 'Location Number Challenge' }
    else if (huntQuestionData[this.state.currentQuestion].type == "continue" ){  headerText = 'WANDER FORWARD WITH PURPOSE' }
    else { headerText = huntQuestionData[this.state.currentQuestion].type.toUpperCase()  }


    let lightningStartTime = this.props.screenProps.groupInfo.lightningRoundStartTime;

    let timePassed =  Math.floor(Date.now() / 1000) - lightningStartTime 
    let timeRemaining = Math.max(huntQuestionData[this.state.currentQuestion].lightning_timer_seconds - timePassed,0)
    if (timeRemaining > 0 && huntQuestionData[this.state.currentQuestion].lightning_timer_seconds != null) {
      setTimeout(() => {
        let lightningRoundBonusPoints = Math.floor(timeRemaining/this.state.currentQuestionObject.lightning_timer_seconds*100);
        lightningRoundBonusPoints = lightningRoundBonusPoints > 200 ? 0 : lightningRoundBonusPoints
        this.setState({lightningRoundBonusPoints});
      }, 1000)
    }

    if(huntQuestionData[this.state.currentQuestion].lightning_timer_seconds == null && this.state.lightningRoundBonusPoints != 0) {
      this.setState({lightningRoundBonusPoints: 0})
    }

    console.log('the passed completion data is: ')
    console.log(this.props.completionData)
    if(this.props.completionData != this.state.completionData) {
        console.log('The completion state update function was fired')
        this.currentStateUpdate(0, this.props.completionData);
    }
      console.log('A rerender is happening')
      console.log('The group info is'); console.log(this.props.screenProps.groupInfo);
      return (
        <ScrollView
          style={{ flex: 1, marginTop: 5 , backgroundColor: 'rgba(0,0,0,0,0)'}}
          ref='_scrollView'
        >
            <View style={{width: width, height: 50, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No1 D', fontSize: 31, marginLeft: 5, marginTop: 5}}>
                {headerText}
                </Text>
                {this.state.questionFinished == false &&
                <View style={{width: 80, height: 40,backgroundColor: '#6AAEAA', 
                    position: 'absolute', top: 5, right: 0}}>
                <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 25, marginBottom: 5, marginTop: 5, marginRight: 10, textAlign: 'right'}}>
                    {this.state.pointsPossible + 'pts'}
                </Text>
                </View>
                }
                <View style={{width: width-140, height: 3,backgroundColor: '#505759', 
                    position: 'absolute', top: 35, left: 5}} />
            </View>
            {(this.state.currentQuestionObject.lightning_timer_seconds == null || lightningStartTime != null || this.state.questionFinished ) &&
              <View style={{paddingLeft: 5, paddingRight: 20}} >
                  <HTML
                  style={{ marginTop: 20 }}
                  baseFontStyle={{ fontFamily: 'CircularStd-Book', fontSize: 15, color: '#505759', textAlign: 'justify' }}
                  containerStyle={{paddingLeft: 5, paddingRight: 20}}
                  html={huntQuestionData[this.state.currentQuestion].question.replace(/<br>/ig, '').replace(/&nbsp;/ig, '').replace(/<p><\/p>/ig, '').replace(/<p[^>]*>[\s|&nbsp;]*<\/p>/, '').replace(/\[Team_Name\]/ig, this.props.screenProps.groupInfo.teamName)}
                  />
                  {this.loadQuestionAnswers()}
                  {(this.state.currentQuestionObject.type == 'continue' || this.state.currentQuestionObject.type == 'scorepage' || this.state.questionFinished == true) &&
                  <TouchableOpacity onPress={() => { this.huntOnPressed() }} style={styles.huntOnButtonStyle}>
                    <Text style={styles.huntOnButtonTextStyle}>
                      {this.state.huntFinished ? 'FINISH HUNT AND SEE RANKING' : 'HUNT ON'}
                    </Text>
                  </TouchableOpacity>
                  
                  }
                  <TouchableOpacity onPress={() => { this.props.showMap();  }} 
                      style={[styles.huntOnButtonStyle, {backgroundColor: 'rgb(80, 87, 89)'}]}>
                      <Text style={styles.huntOnButtonTextStyle}>
                        SEE MAP
                      </Text>
                  </TouchableOpacity>
              </View>
            }
            {this.state.currentQuestionObject.lightning_timer_seconds != null && lightningStartTime == null && !this.state.questionFinished &&
              <View>
                <View style={{backgroundColor: '#E87722', paddingBottom: 20, marginTop: 20, alignItems: 'center'}} >
                  <Text style={{textAlign: 'center', color: 'white', marginTop: 25, fontSize: 20, fontFamily: 'Alternate Gothic No3 D'}}>
                    {'This is a lightning round question!'.toUpperCase()}
                  </Text>
                  <View style={{height: 2, width: width-100, backgroundColor: 'white', marginTop: 10}} />
                  <Text style={{textAlign: 'center', color: 'white', marginTop: 20, fontSize: 20, fontFamily: 'Alternate Gothic No3 D'}}>
                    {('You will have '+this.state.currentQuestionObject.lightning_timer_seconds+' to answer this question. The faster you answer the question the more points you will get!').toUpperCase()}
                  </Text>
                  <Text style={{textAlign: 'center', color: 'white', marginTop: 20, fontSize: 20, fontFamily: 'Alternate Gothic No3 D'}}>
                    {('Make sure you are at the questionThe question will begin when anyone on your team presses "I am Ready"').toUpperCase()}
                  </Text>
                  <Text style={{textAlign: 'center', color: 'white', marginTop: 20, fontSize: 20, fontFamily: 'Alternate Gothic No3 D'}}>
                    {('Good Luck!').toUpperCase()}
                  </Text>
                </View>
                  <TouchableOpacity onPress={() => { 
                    this.props.screenProps.startLightningTimer(); 
                    }} 
                    style={[styles.huntOnButtonStyle, {backgroundColor: '#53A6C4'}]}>
                    <Text style={styles.huntOnButtonTextStyle}>
                      I'm Ready
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.props.showMap();  }} 
                      style={[styles.huntOnButtonStyle, {backgroundColor: 'rgb(80, 87, 89)'}]}>
                      <Text style={styles.huntOnButtonTextStyle}>
                        SEE MAP
                      </Text>
                  </TouchableOpacity>
              </View>
            }
            {lightningStartTime != null && !this.state.questionFinished &&
              <View>
                <Text style={{textAlign: 'center', fontFamily: 'CircularStd-Book', fontSize: 18, color: '#505759', margingTop: 10}}>
                  {timeRemaining > 0 ? (timeRemaining +' seconds left!') : 'Time is up!'}
                </Text>
                <Text style={{textAlign: 'center', fontFamily: 'CircularStd-Book', fontSize: 13, color: '#505759'}}>
                  {timeRemaining > 0 ? 'Answer now for ' + this.state.lightningRoundBonusPoints + ' bonus points!' : 'Answer for regular points'}
                </Text>
              </View>
            }
            
        </ScrollView>
      )
    }

  
  currentStateUpdate(currentQuestionIncrease, newCompletionData) {
    let huntQuestionData = global.huntQuestionData;

    currentQuestion = this.state.currentQuestion + currentQuestionIncrease


    //checking to see if the current question increased
    let completionData = newCompletionData
    if (newCompletionData != null) {
        completionData = newCompletionData
        let completedQuestionArray = Object.values(completionData).map((d) => parseInt(d.questionNumber))
        console.log(completedQuestionArray)
        let maxCompletedQuestion = Math.max.apply(Math,completedQuestionArray);
        if (maxCompletedQuestion >  currentQuestion) {
            currentQuestion = maxCompletedQuestion;
        }
        console.log('the highest completed question is ' + parseInt(maxCompletedQuestion)) 
    }

    let feedback = null

    //getting the last completion time for the current question
    let lastCompletionTime= null;
    if (completionData != null) {
        let completionTimeArray = Object.values(completionData).map((d) => 
          d.questionNumber == currentQuestion ? d.completionTime : 0 
        )
        console.log(completionTimeArray)
        lastCompletionTime = Math.max.apply(Math,completionTimeArray);
    }
    console.log('the highest completion time is ' + lastCompletionTime) 

    let currentQuestionObject = huntQuestionData[currentQuestion]

    let correctAnswer = huntQuestionData[currentQuestion].answers[0]
    
    //defining the answer options for multiple choices
    let questionOptions = null
    if (currentQuestionObject.type == 'question') {
      questionOptions = (huntQuestionData[currentQuestion].answers);
    } 



    //defining if the question was answered correctly for multiple choice
    let questionFinished = false
    if (completionData != null && currentQuestionObject.type == "question" ) {
      let correctAnswerCheck = Object.values(completionData).find(completion => (completion.guess != null && completion.guess === completion.correctAnswer && completion.questionNumber === currentQuestion))
      console.log('the correct answer check is '); console.log(correctAnswerCheck)
      if (typeof correctAnswerCheck != "undefined") {
        questionFinished = true
        feedback='You got it!'
      }
    }

    //defining if the question was answered correctly for fill in the blank
    //also generating the hint
    let fill_in_the_blank_hint = correctAnswer != null ? correctAnswer.toLowerCase().replace(/\w/ig, '_ ') : ''
    let fill_in_the_blank_wrong_letters = 0;
    if (completionData != null && currentQuestionObject.type == "fill_in_the_blank" ) {
      correctAnswer = typeof correctAnswer != 'number' ? correctAnswer.toLowerCase() : correctAnswer
      let attemptCount = 0
      let correctAnswerCheck = Object.values(completionData).find(completion => {
        attemptCount = completion.questionNumber === currentQuestion ? attemptCount + 1 : attemptCount
        completion.guess = typeof completion.guess != 'number' ? completion.guess.toLowerCase() : completion.guess
        console.log()
        return (completion.guess != null && completion.guess === correctAnswer && completion.questionNumber === currentQuestion)
      })
      console.log('the correct answer check is '); console.log(correctAnswerCheck)
      if (typeof correctAnswerCheck != "undefined") {
        questionFinished = true
        feedback='You got it!'
      } else if (attemptCount > 2) {
        questionFinished = true
        feedback='You are out of attempts'
      }
      let answer_letters = [];
      let regex = /\w/ig;
      let correctCharacterCount = 0;
      let lastGuess = Object.values(completionData).find((completion) => (completion.guess != null && completion.completionTime == lastCompletionTime && completion.questionNumber === currentQuestion))
      console.log('The last guess was: '); console.log(lastGuess);
      if (typeof lastGuess != "undefined") {
        fill_in_the_blank_hint = ''
        lastGuess = lastGuess.guess.toLowerCase()
        console.log('The last guess is not undefined')
        while (answer_letters = regex.exec(correctAnswer)) {
          console.log('The next letter is')
          console.log(answer_letters[0])
          console.log('The Index alt is ' + answer_letters.index)
          if (lastGuess.charAt(answer_letters.index) == answer_letters[0]) {
            correctCharacterCount = correctCharacterCount + 1;
            fill_in_the_blank_hint = fill_in_the_blank_hint + answer_letters[0] + ' ';
          } else {
            fill_in_the_blank_hint = fill_in_the_blank_hint + '_ ';
            fill_in_the_blank_wrong_letters = fill_in_the_blank_wrong_letters + 1;
          }
        }
      } 
    }

    //defining when the number guesser is done (is more than 1 guess done)
    if (completionData != null && currentQuestionObject.type == "numberguesser" ) {
      let correctAnswer = Object.values(completionData).find(completion => (completion.guess != null && completion.questionNumber === currentQuestion))
      console.log('the correct answer is '); console.log(correctAnswer)
      if (typeof correctAnswer != "undefined") {
        questionFinished = true
      }
    }

     //calculcating points possible at any given time
     let pointsPossible = 100
     if (currentQuestionObject.type == "question" || currentQuestionObject.type == "fill_in_the_blank" ) {
      let previousCompletors = 0;
        if (completionData != null) {
          Object.values(completionData).map((completion) => {
            if (completion.questionNumber == currentQuestion) {
              previousCompletors = previousCompletors  + 1
              console.log('the completion count was upgraded')
            }
        })
      }
      pointsPossible = 100 - (20* previousCompletors)
     }

    if (currentQuestionObject.type == "question" ) {
      if (pointsPossible == 80 && !questionFinished) {
        feedback='Dang, try again!'
      } else if (pointsPossible == 60 && !questionFinished) {
        feedback='What are you stupid!'
      } else if (pointsPossible == 40 && !questionFinished) {
        feedback='Well fuck you are dumb'
      } else if (pointsPossible == 20 && !questionFinished) {
        feedback='Fuck off! Dummy!'
      }
    } else if (currentQuestionObject.type == "fill_in_the_blank" ) {
      if (pointsPossible < 100 && !questionFinished) {
        feedback='You where '+ fill_in_the_blank_wrong_letters + ' characters off. Try again'
      }
    } 

    let huntFinished = false
    if (huntQuestionData != null && huntQuestionData.length-1 <= currentQuestion) {
      huntFinished = true
    }
    

    console.log('the current state has been updated')
    console.log('The current question object is'); console.log(currentQuestionObject);
    console.log('The correct question answer'); console.log(correctAnswer);
    console.log('The question choices/options are'); console.log(questionOptions);
    console.log('The question was finished? '); console.log(questionFinished);
    console.log('The points possible are'); console.log(pointsPossible);
    console.log('The feedback is'); console.log(feedback);
    console.log('the fill in the blank hint is: '); console.log(fill_in_the_blank_hint)
    console.log('the hunt is finished: '); console.log(huntFinished)

    this.setState({
      currentQuestionObject,
      correctAnswer,
      questionOptions,
      questionFinished,
      pointsPossible, 
      feedback,
      currentQuestion: currentQuestion,
      completionData: newCompletionData,
      fill_in_the_blank_hint,
      huntFinished
    })

    this.props.updateFeedback(feedback);

    let coordinates = [currentQuestionObject.lat, currentQuestionObject.long]
    this.props.updateCoordinates(coordinates);
  }

    loadQuestionAnswers() {
        if (huntQuestionData[this.state.currentQuestion].type == 'question') {
          if (this.state.questionFinished == false) {
            console.log('the questionOptions are '); console.log(this.state.questionOptions)
            return (
              <View>
                {this.state.questionOptions != null &&
                  SeededShuffle.shuffle(this.state.questionOptions,this.state.currentQuestion,true).map((item) => {
                    let guessed = 0
                    if (this.state.completionData != null) {
                      console.log('the answer being analyzed is '); console.log(matchedAnswer);
                    let matchedAnswer = Object.values(this.state.completionData).find(completion => {
                      let check = typeof item != 'number' ? item.toLowerCase() : item 
                      completion.guess = typeof completion.guess != 'number' ? completion.guess.toLowerCase() : completion.guess 
                      return (completion.guess === check && completion.questionNumber == this.state.currentQuestion)
                    })
                    console.log('the matched answer is '); console.log(matchedAnswer);
                    guessed = typeof matchedAnswer != "undefined" ? 1 : 0
                    }
                    return (
                      <TouchableOpacity onPress={() => { guessed == 1 ? '' : this.answerCheck(item) }}
                        style={[styles.huntOnButtonStyle, {backgroundColor: guessed == 1 ? 'red' : '#A7A8AA' }]}>
                        <Text style={[styles.huntOnButtonTextStyle, guessed == 1 && { textDecorationLine: 'line-through' }]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            );
          } else {
            return (
              <TouchableOpacity
                style={[styles.huntOnButtonStyle, {backgroundColor: 'green' }]}>
                <Text style={styles.huntOnButtonTextStyle}>
                  {this.state.correctAnswer}
                </Text>
              </TouchableOpacity>
            )
          }
    
          //are there any previous answers?
          if (this.state.completionData != null) {
            
            //are any of the previous answers correct
            let correctAnswer = Object.values(this.state.completionData).find(completion => (completion.guess === completion.correctAnswer))
            if (typeof correctAnswer != "undefined") {
              let correctAnswer = Object.values(this.state.completionData).find(completion => (completion.guess === completion.correctAnswer))
              
            }
    
            
    
          }
    
          
        } else if (huntQuestionData[this.state.currentQuestion].type == 'numberguesser') {
          if (this.state.questionFinished == false) {
            let correctAnswer = this.state.correctAnswer;
            let numberguesser_min = 0
            let numberguesser_max = 1
            if (correctAnswer <= 10) {
              numberguesser_min = 0;
              numberguesser_max = 20;
              //creates a range from [0: 20]
            } else if (correctAnswer <= 20) {
              numberguesser_min = 0;
              numberguesser_max = 20 //+ Math.floor(Math.random() * 2) * 10;
              //creates a range from [0: random (20 - 40)]
            } else if (correctAnswer <= 40) {
              numberguesser_min = 0;
              numberguesser_max = 40 //+ Math.floor(Math.random() * 6) * 10;
              //creates a range from [0: random (40 - 100)]
            } else if (correctAnswer <= 100) {
              numberguesser_min = 0;
              numberguesser_max = 100 //+ Math.floor(Math.random() * 5) * 10;
              //creates a range from [0: random (40 - 90)]
            } else if (correctAnswer <= 1500) {
              numberguesser_min = Math.floor(correctAnswer / 200) * 100 // - Math.floor(Math.random() * 1) * 100;
              numberguesser_max = Math.ceil(correctAnswer / 50) * 100 //+ Math.floor(Math.random() * 2) * 100;
            } else if (correctAnswer >= 1500 && correctAnswer <= 2030) {
              //round up or down to nearest hundred
              numberguesser_min = Math.floor(correctAnswer / 100) * 100;
              numberguesser_max = Math.ceil(correctAnswer / 100) * 100;
            } else {
              numberguesser_min = Math.floor(correctAnswer / 200) * 100 //- Math.floor(Math.random() * 1) * 100;
              numberguesser_max = Math.ceil(correctAnswer / 50) * 100 //+ Math.floor(Math.random() * 2) * 100;
            }
            console.log('The minimum of the slider is ' + numberguesser_min);
            console.log('The maximum of the slider is ' + numberguesser_max);
            return (
              <View style={{alignItems: 'center'}}>
                <Slider
                  style={{ width: this.props.width - 100 }}
                  step={1}
                  minimumValue={numberguesser_min}
                  maximumValue={numberguesser_max}
                  value={this.state.guess}
                  onValueChange={(val) => this.setState({ guess: val })}
                  onSlidingComplete={() => console.log('this is when the text should be updated')}
                />
                <Text style={{ textAlign: 'center' }}> {this.state.guess} </Text>
                <TouchableOpacity onPress={() => { this.answerCheck(this.state.guess) }} style={styles.huntOnButtonStyle}>
                  <Text style={styles.huntOnButtonTextStyle}>
                    Submit Your Guess
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }
        } else if (huntQuestionData[this.state.currentQuestion].type == 'fill_in_the_blank') {
          let hint = this.state.fill_in_the_blank_hint
          if (this.state.questionFinished == false) {
            return (
              <View>
                <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: 'CircularStd-Book', fontSize: 15, color: '#505759' }}> {'Hint: ' + hint} </Text>
                <TextInput
                  style={{ height: 50, fontFamily: 'CircularStd-Book', fontSize: 20, color: '#505759' }}
                  textAlign={'center'}
                  placeholder="Enter your guess here!"
                  onChangeText={(guess) => this.setState({ guess })}
                />
                <TouchableOpacity onPress={() => { this.answerCheck(this.state.guess) }} style={styles.huntOnButtonStyle}>
                  <Text style={styles.huntOnButtonTextStyle}>
                    Submit Your Guess
                  </Text>
                </TouchableOpacity>
              </View>
            )
          } else {
            return(
              <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: 'CircularStd-Book', fontSize: 15, color: '#505759' }}>
                {'The correct answer is: ' + this.state.correctAnswer} 
              </Text>
            )
          }



        } else { //not a recogonized question type
          <TouchableOpacity onPress={() => { this.huntOnPressed() }} style={styles.huntOnButtonStyle}>
            <Text style={styles.huntOnButtonTextStyle}>
             {this.state.huntFinished ? 'FINISH HUNT AND SEE RANKING' : 'HUNT ON'}
           </Text>
         </TouchableOpacity>
        }
        
      }

      huntOnPressed() {
        console.log('hunt on pressed ')
        if (this.state.currentQuestion == global.huntQuestionData.length - 1) {
          this.props.screenProps.finishHunt();
        } else {
          this.currentStateUpdate(1, this.state.completionData)
        }
    
    
        this.refs._scrollView.scrollTo({ x: 0, animated: false });
      }
    
      answerCheck(guess) {
        console.log('button button fun fun')
        if (this.state.currentQuestionObject.type == 'question' || this.state.currentQuestionObject.type == 'fill_in_the_blank') {
          console.log('the answer check function is firing')
          //Calculating the number of points for the team in total 
          
          console.log(huntQuestionData[this.state.currentQuestion].type)
          if(this.state.guess != null && (typeof this.state.guess != "number" || this.state.currentQuestionObject.type == 'question')) {
            this.props.screenProps.createCompletionEvent(guess, this.state.currentQuestion, this.state.pointsPossible, huntQuestionData[this.state.currentQuestion].answers[0], huntQuestionData[this.state.currentQuestion].type, this.state.lightningRoundBonusPoints, '' )
          } else if (this.state.guess == 0) {
            Alert.alert('Please enter a non-blank guess')
          } else {
            Alert.alert('Please enter a non-numeric guess')
          }

        } else if (this.state.currentQuestionObject.type == 'numberguesser') {
          console.log('the answer check function is firing')
          
          let correctAnswer = huntQuestionData[this.state.currentQuestion].answers[0]
          let difference = Math.abs(this.state.guess - correctAnswer);
    
          let difference_percent = difference / correctAnswer;
          console.log('The correct answer is ' + correctAnswer);
          let numberguesserPointsPossible = 0
          if (difference_percent < .001) {
            numberguesserPointsPossible = 100;
          } else if (difference_percent < .10) {
            numberguesserPointsPossible = 70;
          } else if (difference_percent < .25) {
            numberguesserPointsPossible = 40;
          } else if (difference_percent < .50) {
            numberguesserPointsPossible = 20;
          } else {
            numberguesserPointsPossible = 0;
          }
    
          this.props.screenProps.createCompletionEvent(guess, this.state.currentQuestion, numberguesserPointsPossible, huntQuestionData[this.state.currentQuestion].answers[0], huntQuestionData[this.state.currentQuestion].type, this.state.lightningRoundBonusPoints, '' ) 
        } 
      
      }
  } 

  styles = {
    huntOnButtonStyle: {
      height: 50,
      width: this.width,
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'stretch',
      backgroundColor: '#E87722',
      marginLeft: 30,
      marginRight: 30,
      marginTop: 10
    },
    huntOnButtonTextStyle: {
      alignSelf: 'center',
      color: '#FFFFFF',
      fontSize: 26,
      fontWeight: '400',
      paddingTop: 10,
      paddingBottom: 10,
      fontFamily: 'Alternate Gothic No3 D',
    },
    buttonWhiteStyle: {
      height: 50,
      width: this.width,
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'stretch',
      backgroundColor: '#6AAEAA',
      borderColor: '#CCC',
      borderWidth: 1,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 10
    },
    buttonWhiteTextStyle: {
      alignSelf: 'center',
      color: '#FFF',
      fontSize: 21,
      fontWeight: '400',
      paddingTop: 10,
      paddingBottom: 10,
      fontFamily: 'Alternate Gothic No3 D',
      letterSpacing: 4,
    },
    container: {
      position: 'absolute',
      ...Platform.select({
        ios: {
          top: 0,
        },
        android: {
          top: 0,
        },
      }),
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  }
  
