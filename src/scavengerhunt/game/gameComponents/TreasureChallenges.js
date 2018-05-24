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

class Row extends Component {
  render() {
    width=this.props.width/5
    let highestCompletion = this.props.highestCompletion
    let imageURL1 = null; let imageURL2 = null; let imageURL3 = null;
    let onPress1 = null; let onPress2 = null; let onPress3 = null;
    let index = this.props.index
    imageURL1 = index[0] <= highestCompletion + 1 ? require('../../../images/treasureActiveIcon.png') : require('../../../images/treasureDoneIcon.png');
    imageURL2 = index[1] <= highestCompletion + 1 ? require('../../../images/treasureActiveIcon.png') : require('../../../images/treasureDoneIcon.png');
    imageURL3 = index[2] <= highestCompletion + 1 ? require('../../../images/treasureActiveIcon.png') : require('../../../images/treasureDoneIcon.png');
    if (this.props.photoList != null) {
      imageURL1 = this.props.photoList[index[0]] != null ? {uri: this.props.photoList[index[0]]} : imageURL1
      imageURL2 = this.props.photoList[index[1]] != null ? {uri: this.props.photoList[index[1]]} : imageURL2
      imageURL3 = this.props.photoList[index[2]] != null ? {uri: this.props.photoList[index[2]]} : imageURL3
    }
    
    
    
    if(this.props.treasureChallenges != null) {
      let treasureChallenges = this.props.treasureChallenges
      console.log('the first challenge is')
      console.log(treasureChallenges[0])
      onPress1 = () => this.props.selectChallenge(index[0]) 
      onPress2 = () => this.props.selectChallenge(index[1]) 
      onPress3 = () => this.props.selectChallenge(index[2]) 
    }
        
    return (
      <View>
        <Dash style={{width:100, height:1, position: 'absolute', width: this.props.width-90, left: 35, top: width/2}}/>
        {this.props.direction == 'left' && this.props.index[2] != 12 &&
        <Dash style={{height:width+40, width:1, flexDirection: 'column', position: 'absolute', height: width, left: this.props.width-width/2-20, top: width/2+22}}/>
        }
        {this.props.direction == 'right' && this.props.index[2] != 12 &&
        <Dash style={{height:width+40, width:1, flexDirection: 'column', position: 'absolute', height: width, left: width/2+20, top: width/2+22}}/>
        }
        <View
          style={{ flex: 1, width:this.props.width, backgroundColor: 'rgba(0,0,0,0,0)',
          flexDirection: this.props.direction == 'right' ? 'row-reverse' : 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, paddingBottom: 40}}
        >
          <TouchableOpacity onPress={onPress1}>
            <Image 
              style={{ width: width, height: width }}
              source={imageURL1}
            />
           </TouchableOpacity>
           <TouchableOpacity onPress={onPress2}>
            <Image 
              style={{ width: width, height: width }}
              source={imageURL2}
            />
            </TouchableOpacity>
           <TouchableOpacity onPress={onPress3}>
            <Image 
              style={{ width: width, height: width }}
              source={imageURL3}
            />
          </TouchableOpacity>
        </View>
    </View>
    )
  }


} 




export default class TreasureChallenges extends Component {
    constructor() {
        super();
    
        this.state = {
          //state needs to be updated when the current question changes and when the completion data changes
          //it should be handled in the exact same manner
          placeholder: null,
          highestCompletion: null,
          selectedChallengeIndex: null
        }
      }
    selectChallenge(){

    }
    render() {
      console.log('The selected challenge is ' + this.state.selectedChallengeIndex)
      width=this.props.width

      console.log('The treasure completion data is'); console.log(this.props.treasureCompletionData)


      let photoList = null
      let treasureCompletionData = null
      if(this.props.treasureCompletionData != null) {
        treasureCompletionData = this.props.treasureCompletionData
        console.log('the treasure completion data in props is: '); console.log(treasureCompletionData)
        
        if (treasureCompletionData.selectedChallengeIndex != null) {
          highestCompletion = treasureCompletionData.selectedChallengeIndex
          photoList=treasureCompletionData.downloadURL
        } else {
            photoList = treasureCompletionData.map((completion) => {
              console.log('photo list fired')
              return completion.downloadURL
            })
            let completedQuestionArray = treasureCompletionData.map((d) => parseInt(d.selectedChallengeIndex))
            console.log(completedQuestionArray)
            highestCompletion = Math.max(Math.max.apply(Math,completedQuestionArray),0);
        }
        if(highestCompletion != this.state.highestCompletion){
          this.setState({highestCompletion, selectedChallengeIndex: null})
        }
        

      }
      console.log('the highest treasure completion is' + this.state.highestCompletion)
      let challengeList = this.props.screenProps.groupInfo.treasureChallengeList!= null ? Object.values(this.props.screenProps.groupInfo.treasureChallengeList): null
      console.log('the challenge list is'); console.log(challengeList)
      console.log('the photo list is'); console.log(photoList)


      

      if (this.state.selectedChallengeIndex == null) {
        return (
          <ScrollView
            style={{ flex: 1, marginTop: 5 , backgroundColor: 'rgba(0,0,0,0,0)'}}
            ref='_scrollView'
            key={this.state.highestCompletion}
          >
            <Row 
              width={width}
              index={[0,1,2]}
              highestCompletion={this.state.highestCompletion}
              direction={'left'}
              treasureChallenges={this.props.treasureChallenges}
              selectChallenge={(selectedChallengeIndex) => this.handleSelectChallenge(selectedChallengeIndex)}
              photoList={photoList}
            />
            <Row 
              width={width}
              index={[3,4,5]}
              highestCompletion={this.state.highestCompletion}
              direction={'right'}
              treasureChallenges={this.props.treasureChallenges}
              selectChallenge={(selectedChallengeIndex) => this.handleSelectChallenge(selectedChallengeIndex)}
              photoList={photoList}
            />
            <Row 
              width={width}
              index={[6,7,8]}
              highestCompletion={this.state.highestCompletion}
              treasureChallenges={this.props.treasureChallenges}
              direction={'left'}
              selectChallenge={(selectedChallengeIndex) => this.handleSelectChallenge(selectedChallengeIndex)}
              photoList={photoList}
            />
            <Row 
              width={width}
              index={[9,10,11]}
              highestCompletion={this.state.highestCompletion}
              direction={'right'}
              treasureChallenges={this.props.treasureChallenges}
              selectChallenge={(selectedChallengeIndex) => this.handleSelectChallenge(selectedChallengeIndex)}
              photoList={photoList}
            />
          </ScrollView>
        )
      }
      else {
        let selectedChallengeIndex = this.state.selectedChallengeIndex
        console.log('the challenge id is'); console.log(selectedChallengeIndex)

        let selectedChallengeId = challengeList[selectedChallengeIndex]

        let challengeObject = this.props.treasureChallenges[selectedChallengeId]
        console.log('the challenge object is'); console.log(challengeObject)
        return (
          
          <ScrollView
            style={{ flex: 1, marginTop: 0 , backgroundColor: 'rgba(0,0,0,0,0)'}}
            ref='_scrollView'
          >
            <Image
              style={{width: width, height: width * 147/376}}
              source={require('../../../images/takePhoto.png')}
            />
            <View style={{width: width, height: 50, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No1 D', fontSize: 31, marginLeft: 5, marginTop: 5, marginLeft: 15}}>
                  {(challengeObject.difficulty + ' Challenge: ' + challengeObject.name).toUpperCase()}
                </Text>
                <View style={{width: 80, height: 40,backgroundColor: '#6AAEAA', 
                    position: 'absolute', top: 5, right: 0}}>
                <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 25, marginBottom: 5, marginTop: 5, marginRight: 10, textAlign: 'right'}}>
                    {100 + 'pts'}
                </Text>
                </View>
            <View style={{width: width-140, height: 3,backgroundColor: '#505759', 
                position: 'absolute', top: 35, left: 5}} />
            </View>
            <View style={{paddingLeft: 5, paddingRight: 20}} >
                  <Text style ={{ fontFamily: 'CircularStd-Book', fontSize: 15, color: '#505759', textAlign: 'justify', marginTop: 20 }}>
                    {challengeObject.description}
                  </Text>
              </View>
            <TouchableOpacity onPress={() => this.handleCameraPress(selectedChallengeIndex, selectedChallengeId, challengeObject.name)} style={styles.huntOnButtonStyle}>
              <Text style={styles.huntOnButtonTextStyle}>
                TAKE PHOTO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({selectedChallengeIndex: null})} style={{position: 'absolute', left: 30, top: 10}}>
              <Text style={styles.huntOnButtonTextStyle}>
                X
              </Text>
            </TouchableOpacity>
          </ScrollView>
        );
      }
    }

    handleSelectChallenge = (selectedChallengeIndex) => {
      //this is the active challenge
      if (selectedChallengeIndex == this.state.highestCompletion + 1 || (selectedChallengeIndex == 0 && this.state.highestCompletion == null)) {
        this.setState({selectedChallengeIndex})
      } else if (selectedChallengeIndex < this.state.highestCompletion + 1) {
        Alert.alert('You have already completed this challenge.')
      } else {
        Alert.alert('You have not unlocked this challenge by doing the previous one.')
      }
    }
    handleCameraPress = (selectedChallengeIndex, selectedChallengeId, title) => {
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
              let downloadURL = response.downloadURL;
              console.log('create treasure completion will fire')
              this.props.screenProps.createTreasureCompletionEvent(selectedChallengeIndex, selectedChallengeId, title, 100, imagePath, response.downloadURL) 
            })
            .catch((err) => {
              console.log(err);
            });
  
        }
      });
  
  
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
  
