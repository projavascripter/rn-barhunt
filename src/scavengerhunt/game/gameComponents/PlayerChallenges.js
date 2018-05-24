import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import HTML from 'react-native-render-html';
import Svg, {Polygon} from 'react-native-svg'
import Dash from 'react-native-dash';

import uuid from 'uuid/v4';

import firebase from 'react-native-firebase';

import ImagePicker from 'react-native-image-picker';

import { getDatabase } from "../../../utils/db";
import fireUtil from '../../../utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;

var SeededShuffle = require('seededshuffle');

export default class LocationChallenges extends Component {
    constructor() {
        super();
    
        this.state = {
          challengeAvailable: false,
          selectedChallengeId: null
        }
      }
    
    render() {
      let width = this.props.width
      let userId = this.props.screenProps.user.info.userId
      console.log('the full player challenge list is: ', this.props.playerChallengeList)
      let playerChallengeList = this.props.playerChallengeList != null ? Object.values(this.props.playerChallengeList[userId]) : []
      
      console.log('the current time is:', Math.floor(Date.now()/1000))
      if (playerChallengeList != []) {
        playerChallengeList.sort((a, b) => {
          if (a.deliveryTime > b.deliveryTime) {
            return 1
          }
          else {
            return -1
          }
        })
      }

      let availableChallenges = []
      let finishedChallenges = []
      playerChallengeList.map((challenges) => {
        if(challenges.deliveryTime < Math.floor(Date.now()/1000)) {
          if (challenges.pointsEarned == null) {
            availableChallenges.push(challenges)
          } else {
            finishedChallenges.push(challenges)
          }
          
        }
      })

    

      console.log('the available challenges are: ', availableChallenges)
      let challengeAvailable = availableChallenges.length > 0
      
      console.log('the selected challenge id is', this.state.selectedChallengeId)
      let selectedChallenge = Object.values(this.props.playerChallenges)[this.state.selectedChallengeId]
      console.log('the selected challenge is', selectedChallenge)

      let selectedPlayerChallenge = playerChallengeList.filter((challenge) => {
        return challenge.challengeId == this.state.selectedChallengeId
      })

      if (this.state.selectedChallengeId == null) {
        return (
          <ScrollView
            style={{ flex: 1, marginTop: 5 , backgroundColor: 'rgba(0,0,0,0,0)'}}
            ref='_scrollView'
          >
            {!challengeAvailable &&
            <View>
              <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 21, marginTop: 14, textDecorationLine: 'underline', textAlign: 'center'}}>
                {('No Challenges Available').toUpperCase()}
              </Text>
              <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 14, marginTop: 14, textAlign: 'center'}}>
                {('Complete more of the hunt for more challenges, or: ').toUpperCase()}
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5}}>
                <TouchableOpacity onPress={() => this.handleCameraPress(selectedChallengeId, selectedChallengeId, challengeObject.name)} 
                  style={{backgroundColor: '#E87722', width: width/3, height: 30, justifyContent: 'center', alignContent: 'center',}}
                >
                    <Text style={{ alignSelf: 'center', color: '#FFFFFF', fontSize: 13, fontWeight: '400', fontFamily: 'Alternate Gothic No3 D',}}>
                      USE 50 COINS
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleCameraPress(selectedChallengeId, selectedChallengeId, challengeObject.name)} 
                style={{backgroundColor: '#53A6C4', width: width/3, height: 30, justifyContent: 'center', alignContent: 'center', marginLeft: 5}}
                >
                    <Text style={{ alignSelf: 'center', color: '#FFFFFF', fontSize: 13, fontWeight: '400', fontFamily: 'Alternate Gothic No3 D',}}>
                      SHARE YOUR HUNT
                    </Text>
                </TouchableOpacity>
              </View>
            </View>
            }
            {challengeAvailable &&
            <View>
              <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 21, marginTop: 14, marginBottom: 10, textDecorationLine: 'underline', textAlign: 'center'}}>
                {('New Challenges Available').toUpperCase()}
              </Text>
              <TouchableOpacity onPress={() => this.setState({selectedChallengeId: availableChallenges[0].challengeId})} style={styles.huntOnButtonStyle}>
                  <Text style={styles.huntOnButtonTextStyle}>
                    See Challenge
                  </Text>
              </TouchableOpacity>
            </View>
            }
            <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 21, marginTop: 14, marginBottom: 10, textDecorationLine: 'underline', marginLeft: 5}}>
              {('Completed Challenges').toUpperCase()}
            </Text>   
            <View style={{flexDirection: 'row', width: width-40, flexWrap:"wrap", justifyContent: 'center', marginTop: 10}} >
              {finishedChallenges.map((challenge) => {
                return (
                <Challenges
                  challenge={challenge}
                />
                )
              })}
            </View>
          </ScrollView>
        )
      }
      
      else if ( selectedChallenge.type == 'Photo') {
        console.log('the selected player challenge is', selectedPlayerChallenge[0])
        selectedChallenge.pointsEarned = selectedPlayerChallenge[0].pointsEarned
        selectedChallenge.photoURL = selectedPlayerChallenge[0].photoURL
        return (
          <ScrollView
              style={{ flex: 1, marginTop: 0 , backgroundColor: 'rgba(0,0,0,0,0)'}}
              ref='_scrollView'
            >
              {selectedChallenge.pointsEarned == null &&
              <Image
                style={{width: width, height: width * 147/376}}
                source={require('../../../images/takePhoto.png')}
              />
              }
              {selectedChallenge.pointsEarned != null &&
              <View
                style={{width: width, height: width * 147/376, alignItems: 'center', alignContent: 'center', justifyContent: 'center', backgroundColor: '#FFC600'}}
                source={require('../../../images/takePhoto.png')}>
                  <Image
                  style={{width: 100, height: 100}}
                  source={{uri: selectedChallenge.photoURL}}
              />
              </View>
              }
              <View style={{width: width, height: 50, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No1 D', fontSize: 31, marginLeft: 5, marginTop: 5, marginLeft: 15}}>
                    {selectedChallenge.type + ' Challenge'}
                  </Text>
                  <View style={{width: 80, height: 40,backgroundColor: '#6AAEAA', 
                      position: 'absolute', top: 5, right: 0}}>
                  <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 25, marginBottom: 5, marginTop: 5, marginRight: 10, textAlign: 'right'}}>
                      {selectedChallenge.points + 'pts'}
                  </Text>
                  </View>
              <View style={{width: width-140, height: 3,backgroundColor: '#505759', 
                  position: 'absolute', top: 35, left: 5}} />
              </View>
              <View style={{paddingLeft: 5, paddingRight: 20}} >
                    <Text style ={{ fontFamily: 'CircularStd-Book', fontSize: 15, color: '#505759', textAlign: 'justify', marginTop: 20 }}>
                      {selectedChallenge.question}
                    </Text>
                </View>
              {selectedChallenge.pointsEarned == null &&
              <TouchableOpacity onPress={() => this.handleCameraPress(selectedChallenge)} style={styles.huntOnButtonStyle}>
                <Text style={styles.huntOnButtonTextStyle}>
                  TAKE PHOTO
                </Text>
              </TouchableOpacity>
              }
              { selectedChallenge.pointsEarned != null &&
              <TouchableOpacity onPress={() => this.setState({selectedChallengeId: null})} style={[styles.huntOnButtonStyle, {backgroundColor: '#505759'}]}>
                <Text style={styles.huntOnButtonTextStyle}>
                  Go Back
                </Text>
              </TouchableOpacity>
              }
              <TouchableOpacity onPress={() => this.setState({selectedChallengeId: null})} style={{position: 'absolute', left: 30, top: 10}}>
                <Text style={styles.huntOnButtonTextStyle}>
                   X
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )
        }

        else if ( selectedChallenge.type == 'Trivia') {
          
          console.log('the selected player challenge is', selectedPlayerChallenge[0])
          selectedChallenge.guess =selectedPlayerChallenge[0].guess
          selectedChallenge.pointsEarned = selectedPlayerChallenge[0].pointsEarned
          selectedChallenge.correctAnswer = selectedPlayerChallenge[0].correctAnswer
          console.log('the trivia challenge being rendered is ', selectedChallenge)
          let answers = selectedChallenge.answer.split("|")
          answers = answers.map((answer) => {
            let split = answer.split(':')
            return {option: split[0], correct: split[1], correctAnswer: answers[0].split(':')[0], selectedChallenge }
          })
          return (
            <ScrollView
                style={{ flex: 1, marginTop: 0 , backgroundColor: 'rgba(0,0,0,0,0)'}}
                ref='_scrollView'
              >
                <View style={{width: width, height: 50, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No1 D', fontSize: 31, marginLeft: 5, marginTop: 5, marginLeft: 15}}>
                      {selectedChallenge.type + ' Challenge'}
                    </Text>
                    <View style={{width: 80, height: 40,backgroundColor: '#6AAEAA', 
                        position: 'absolute', top: 5, right: 0}}>
                    <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 25, marginBottom: 5, marginTop: 5, marginRight: 10, textAlign: 'right'}}>
                        {selectedChallenge.points + 'pts'}
                    </Text>
                    </View>
                <View style={{width: width-140, height: 3,backgroundColor: '#505759', 
                    position: 'absolute', top: 35, left: 5}} />
                </View>
                <View style={{paddingLeft: 5, paddingRight: 20}} >
                      <Text style ={{ fontFamily: 'CircularStd-Book', fontSize: 15, color: '#505759', textAlign: 'justify', marginTop: 20 }}>
                        {selectedChallenge.question}
                      </Text>
                  </View>
                  { selectedChallenge.guess != null && selectedChallenge.pointsEarned > 0 &&
                    <View>
                      <View
                      style={[styles.huntOnButtonStyle, {backgroundColor: 'green' }]}>
                        <Text style={[styles.huntOnButtonTextStyle]}>
                          {selectedChallenge.guess}
                        </Text>
                      </View>
                      <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 14, marginTop: 14, textAlign: 'center'}}>
                        {('You got it right! You earned ' + selectedChallenge.pointsEarned + ' Points!').toUpperCase()}
                      </Text>
                    </View>
                }
                { selectedChallenge.guess != null && selectedChallenge.pointsEarned == 0 &&
                    <View>
                      <View
                      style={[styles.huntOnButtonStyle, {backgroundColor: 'red' }]}>
                        <Text style={[styles.huntOnButtonTextStyle]}>
                          {selectedChallenge.guess}
                        </Text>
                      </View>
                      <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 14, marginTop: 14, textAlign: 'center'}}>
                        {('Sorry, the correct answer was ' + selectedChallenge.correctAnswer).toUpperCase()}
                      </Text>
                    </View>
                }
                {selectedChallenge.guess == null && 
                SeededShuffle.shuffle(answers,10,true).map((item) => {
                    return (
                      <TouchableOpacity onPress={() => { this.props.screenProps.completeTriviaChallenge(item)}}
                        style={[styles.huntOnButtonStyle, {backgroundColor: '#A7A8AA' }]}>
                        <Text style={[styles.huntOnButtonTextStyle]}>
                          {item.option}
                        </Text>
                      </TouchableOpacity>
                    )
                  })
                }
                <TouchableOpacity onPress={() => this.setState({selectedChallengeId: null})} style={[styles.huntOnButtonStyle, {backgroundColor: '#505759'}]}>
                  <Text style={styles.huntOnButtonTextStyle}>
                   Go Back
                 </Text>
                </TouchableOpacity>
              </ScrollView>
            )
          }
    }
    handleCameraPress = (selectedChallenge) => {
      // More info on all the options is below in the README...just some common use cases shown here
      var options = {
        title: 'COMPLETE PHOTO CHALLENGE',
        quality: 0,
        // customButtons: [
        //   {name: 'fb', title: 'Choose Photo from Facebook'},
        // ],
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };
  
      ImagePicker.showImagePicker(options, async (response) => {
        console.log('Response = ', response);
        let { height, width } = response;
  
        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
  
          let uri = response.uri;
  
          let imageId = uuid();
          let imagePath = `images/scavengerHunt/${this.props.screenProps.groupInfo.groupId}/${imageId}`;
  
  
          // url: images/$barHuntId/$imageId
          firebase
            .storage()
            .ref(imagePath)
            .putFile(
              uri
            )
            .then(async (response) => {
  
              // create challenge completion object
              let imageRef = response.ref;
              selectedChallenge.downloadURL = response.downloadURL;
              console.log('create photo challenge completion will fire')
              this.props.screenProps.completePhotoChallenge(selectedChallenge) 
            })
            .catch((err) => {
              console.log(err);
            });
  
        }
      });
  
  
    }
  } 

  class Challenges extends Component {
    render() {
      let challenge = this.props.challenge
      return (
        <View style={{width: 90, height: 85, alignItems: 'center', alignContent: 'center', marginBottom: 10, marginLeft: 15, margingRight: 15}} >
          <Image
            source={require('../../../images/completedChallengeIcon.png')}
            style={{height: 70, width: 70, borderRadius: 30 }}
          />
          <View style={{position: 'absolute', height: 30, left: 0, right: 0, bottom: 0, backgroundColor: '#6AAEAA', justifyContent: 'center'}}>
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 17, fontFamily: 'Alternate Gothic No3 D'}}>
              {challenge.pointsEarned + ' PTS'}
            </Text>
          </View>
        </View>
      )
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
    bonusButtonStyle: {
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
    bonusButtonTextStyle: {
      alignSelf: 'center',
      color: '#FFFFFF',
      fontSize: 15,
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
  
