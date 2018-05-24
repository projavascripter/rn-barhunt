/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  AsyncStorage,
  ScrollView,
  Linking,
  TextInput,
  SafeAreaView,
  Slider,
  Keyboard,
  ImagePicker
} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../../images/logo.png");
let logo3 = require("../../images/logo3.png");
import LetsRoamHeader from '../../modules/LetsRoamHeader';
import Svg, {Polygon} from 'react-native-svg'

import { getDatabase } from "../../utils/db";
import fireUtil from '../../utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;

import GameLobby from './GameLobby'
import Game_Loading from './Game_Loading'
import CharacterSelection from './CharacterSelection'

import AppHeader from './gameComponents/AppHeader'
import AppFooter from './gameComponents/AppFooter'
import LocationChallenges from './gameComponents/LocationChallenges'
import PlayerChallenges from './gameComponents/PlayerChallenges'
import TreasureChallenges from './gameComponents/TreasureChallenges'
import Map from './gameComponents/Map'
import HuntFinished from './gameComponents/HuntFinished'

import FCM, {NotificationActionType} from "react-native-fcm";

import moment from 'moment'

function shuffleArray(array) {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

let { width, height } = Dimensions.get("window");


const CenterText = styled.Text`
 text-align: center;
`;

const styles = StyleSheet.create({
  statusBarBackground: {
    marginTop: (Platform.OS === 'ios') ? 20 : 0, //this is just to test if the platform is iOS to give it a height of 20, else, no height (Android apps have their own status bar)
    color: '#464D4F'
  },
  modalStatusBarBackground: {
    top: (Platform.OS === 'ios') ? 20 : 0, //this is just to test if the platform is iOS to give it a height of 20, else, no height (Android apps have their own status bar)
    color: '#464D4F'
  }

})

export default class extends Component {

  static navigationOptions = {
    title: "Let's Roam Home",
    header: null
  };

  constructor() {
    super();

    this.state = {
      completionData: null,
      showFooter: true,
      //gameView: "Location",
      gameView: "Player",
      treasureChallenges: null,
      coordinates: null,
      treasureCompletionData: null,
      playerChallenges: null,
      playerChallengeList: null
    }
  }
  async componentDidMount() {
    
    

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    //level 0 getting currentBarHuntId
    let groupId = this.props.screenProps.groupInfo.groupId
    let groupReference = getDatabase().ref(`scavengerhunt/groups/${groupId}`);
    groupReference.on("value", (snapshot) => {
      let groupData = snapshot.val()
      this.props.screenProps.firebaseUpdateGroupInfo(groupData)

      //getting the treasure challenges
      let treasureChallengesReference = getDatabase().ref(`scavengerhunt/treasureChallenges/`);
      treasureChallengesReference.on("value", (snapshot) => {
      let treasureChallenges = snapshot.val()
        if(treasureChallenges != null) {
          if(groupData.treasureChallengeList == null) {
            treasureChallenges = Object.values(treasureChallenges)
            easyChallenges = []
            mediumChallenges = []
            hardChallenges = []
            data = treasureChallenges.map((value) => {
              if (value.difficulty == 'easy') {
                easyChallenges.push(value.challengeId)
              } else if (value.difficulty == 'medium') {
                mediumChallenges.push(value.challengeId)
              } else {
                hardChallenges.push(value.challengeId)
              }
            })
            let easyChallenges = shuffleArray(easyChallenges).slice(0,4)
            let mediumChallenges = shuffleArray(mediumChallenges).slice(0,4)
            let hardChallenges = shuffleArray(hardChallenges).slice(0,4)
            let treasureChallengeList = [easyChallenges[0], easyChallenges[1], easyChallenges[2], easyChallenges[3], 
                      mediumChallenges[0], mediumChallenges[1], mediumChallenges[2], mediumChallenges[3],
                      hardChallenges[0], hardChallenges[1], hardChallenges[2], hardChallenges[3]]
            console.log('the selected challenges are'); console.log(treasureChallengeList);
            setDataAtPath(`scavengerhunt/groups/${groupId}/treasureChallengeList`, treasureChallengeList)
            
          }
        }  
        this.setState({treasureChallenges })
      });

      
      //getting the treasure challenges
      let playerChallengesReference = getDatabase().ref(`scavengerhunt/playerChallenges/${groupData.theme.toLowerCase()}`);
      playerChallengesReference.on("value", (snapshot) => {
        console.log('the date time is', new Date().getTime()+20000)
        
        
        let playerChallenges = snapshot.val()
          this.setState({playerChallenges })
          if(playerChallenges != null) {
            let groupInfo = Object.values(groupData)
            let userId = this.props.screenProps.user.info.userId
            let character = groupData.players[userId].character
            
            // userId = 7
            // character = "student"

            //seeing if the list is populated
            let playerChallengeListReference = getDatabase().ref(`scavengerhunt/playerChallengeList/${groupId}`);
            playerChallengeListReference.on("value", (snapshot) => {
              console.log('the snapshot is, ', snapshot.val())
              let playerChallengeList = snapshot.val();
              this.setState({playerChallengeList })

              //scheduling push notifications
              if( playerChallengeList != null &&  playerChallengeList[userId] != null) {
                Object.values(playerChallengeList[userId]).map((challenge) => {
                  FCM.scheduleLocalNotification({
                    id: 'testnotif',
                    fire_date: Date.now()+1000,
                    title: 'Test Notification with action',
                    body: 'Force touch to reply',
                    priority: "high",
                    show_in_foreground: true,
                    click_action: "com.myidentifi.fcm.text", // for ios
                    extra1: {a: 1},
                    extra2: 1
                  });
                }) 
                FCM.getScheduledLocalNotifications((notification) => {
                  console.log('The notification is: ', notification)
                })
              }

              if((snapshot.val() == null  || snapshot.val()[userId] == null) && character!=null) {
                playerChallenges = Object.values(playerChallenges)
                let triviaChallenges = []; let photoChallenges = []; let youngsterChallenges = []; let studentChallenges = [];
                let allTriviaChallenges = []; let allPhotoChallenges = []; let allYoungsterChallenges = []; let allStudentChallenges = [];

                let previouslyAssignedChallenges = [-1]
                if(snapshot.val() != null) {
                  previouslyAssignedChallengesArray = Object.values(snapshot.val())
                  previouslyAssignedChallengesArray.map((user) => {
                    Object.values(user).map((challengeId) => {
                      previouslyAssignedChallenges.push(challengeId.challengeId)
                    })
                  })
                }

                //going through assigning all challenges
                console.log('the previously assinged challenges are: ', previouslyAssignedChallenges.sort())
                playerChallenges.map((value) => {
                  if (value.questionPool == 'Student' ) {
                    allStudentChallenges.push(value.challengeId)
                    if(!previouslyAssignedChallenges.includes(value.challengeId)) {
                      studentChallenges.push(value.challengeId)
                    }
                  } else if (value.questionPool == 'Kid') {
                    allYoungsterChallenges.push(value.challengeId)
                    if(!previouslyAssignedChallenges.includes(value.challengeId)) {
                      youngsterChallenges.push(value.challengeId)
                    }
                  } else if (value.type == 'Photo') {
                    allPhotoChallenges.push(value.challengeId)
                    if(!previouslyAssignedChallenges.includes(value.challengeId)) {
                      photoChallenges.push(value.challengeId)
                    }
                  } else if (value.type == 'Trivia') {
                    allTriviaChallenges.push(value.challengeId)
                    if(!previouslyAssignedChallenges.includes(value.challengeId)) {
                      triviaChallenges.push(value.challengeId)
                    }
                  }
                })
                //if we are out of challenges the old challenges are reused
                studentChallenges = studentChallenges.length < 5 ? allStudentChallenges : studentChallenges
                youngsterChallenges = youngsterChallenges.length < 5 ? allYoungsterChallenges : youngsterChallenges
                triviaChallenges = triviaChallenges.length < 5 ? allTriviaChallenges : triviaChallenges
                photoChallenges = photoChallenges.length < 5 ? allPhotoChallenges : photoChallenges
                console.log('the possible trivia challenges are: ',  allTriviaChallenges)

                //assigning the challenges to the specific players
                let assignedChallenges = []
                if(character == "student") {
                  assignedChallenges = shuffleArray(studentChallenges).slice(0,8)
                } else if (character == "youngster") {
                  assignedChallenges = shuffleArray(youngsterChallenges).slice(0,8)
                } else if (character == "photographer") {
                  assignedChallenges = shuffleArray(photoChallenges).slice(0,8)
                } else if (character == "explorer") {
                  let assignedPhotoChallenges =  shuffleArray(photoChallenges).slice(0,6)
                  console.log('the assigned photo challenges are: ', assignedPhotoChallenges)
                  let assignedTriviaChallenges = shuffleArray(triviaChallenges).slice(0,2)
                  assignedChallenges = shuffleArray([assignedPhotoChallenges[0], assignedPhotoChallenges[1], assignedPhotoChallenges[2], assignedPhotoChallenges[3], 
                    assignedPhotoChallenges[4], assignedPhotoChallenges[5], triviaChallenges[0], triviaChallenges[1]])
                } else if (character == "braniac") {
                  let assignedPhotoChallenges =  shuffleArray(photoChallenges).slice(0,2)
                  let assignedTriviaChallenges = shuffleArray(triviaChallenges).slice(0,6)
                  assignedChallenges = shuffleArray([assignedPhotoChallenges[0], assignedPhotoChallenges[1],
                    triviaChallenges[0], triviaChallenges[1], triviaChallenges[2], triviaChallenges[3], triviaChallenges[4], triviaChallenges[5]])
                }

                //creating the random time array
                let timeInterval = 1 //in minutes
                let timeArray = []
                for (var i = 0; i < 8; i++) {
                  newTime = 2 + timeInterval * i + timeInterval * Math.random()
                  timeArray.push(newTime);
               }
               console.log('the time array is: ', timeArray)

                let assignedChallengesObject = {}
                let j = 0
                assignedChallenges.map((challenge) => {
                  if (challenge != null) {
                    let newChallenge = {
                      challengeId: challenge,
                      deliveryTime: Math.floor(Date.now() / 1000) + 60 * timeArray[j]}
                    assignedChallengesObject[challenge] = newChallenge
                    j = j + 1
                  }
                }) 
                console.log('the assignedChallengesObject is: ', assignedChallengesObject)

                //settign the data
                setDataAtPath(`scavengerhunt/playerChallengeList/${groupData.groupId}/${userId}`, assignedChallengesObject)
              }
            }) 
        }
      }); 

    });
    let completionReference = getDatabase().ref(`scavengerhunt/locationCompletions/${groupId}`);
    completionReference.on("value", (snapshot) => {
      let completionData = snapshot.val()
      this.setState({completionData})
    });

    //treasure completions
    let treasureCompletionReference = getDatabase().ref(`scavengerhunt/treasureCompletions/${groupId}`);
    //treasureCompletionReference.orderByChild("selectedChallengeIndex").equalTo(1)
    treasureCompletionReference.on("value", (snapshot) => {
      let treasureCompletionData = null
      if (snapshot.val() != null) {
        treasureCompletionData = this.objectValues(snapshot.val())
        if (treasureCompletionData.length > 1) {
          treasureCompletionData = treasureCompletionData.sort((a,b) => {
            console.log('as selected challenge index is' + parseInt(a.selectedChallengeIndex))
            console.log('bs selected challenge index is' + parseInt(b.selectedChallengeIndex))
            console.log('a is greater than b'+ (parseInt(a.selectedChallengeIndex) > parseInt(b.selectedChallengeIndex)))
            console.log('----')
            if(parseInt(a.selectedChallengeIndex) < parseInt(b.selectedChallengeIndex)) return -1;
            if(parseInt(a.selectedChallengeIndex) > parseInt(b.selectedChallengeIndex)) return 1;
            return 0;
            
          })
        }
        console.log('jsonss'); console.log(treasureCompletionData)
        if (treasureCompletionData != this.state.treasureCompletionData) {
          this.setState({treasureCompletionData})
        }
      }
    });
  }

  objectValues = (object) => {
    if (object != null) {
      if (object.selectedChallengeIndex == null) {
        console.log('the evaluated object is: '); console.log(object)
        return Object.values(object)
      }
    }
    return object
  }
  shuffleArray = (arr) => {
    arr
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  };

  render() {

    let character = this.props.screenProps.groupInfo.players[this.props.screenProps.user.info.userId].character
    console.log('On the main app page, the character is', character)
    if(this.state.treasureChallenges != null){
      console.log('the treasure challenges in state are')
      console.log(this.state.treasureChallenges)
    }

    if(this.props.screenProps.groupInfo.huntStarted != true) {
      return (
        <GameLobby
          groupInfo={this.props.screenProps.groupInfo}
          screenProps={this.props.screenProps}
        />
      )
    }

    //CharacterSelection
    if(this.props.screenProps.groupInfo.huntStarted == true && this.props.screenProps.groupInfo.players[this.props.screenProps.user.info.userId].character == null) {
      return (
        <CharacterSelection
          groupInfo={this.props.screenProps.groupInfo}
          screenProps={this.props.screenProps}
        />
      )
    }
    
    if(this.props.screenProps.groupInfo.huntFinished == true) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
        <LetsRoamHeader  
          handleDrawerPress={this.props.screenProps.handleDrawerPress}
        />

        <Image
          source={require('../../images/thanksHuntingBanner.png')}
          style={{position: 'absolute', left: 0, right: 0, top: (Platform.OS === 'ios') ? 70 : 50, height: 60, width: width}}
          resizeMode="stretch"
          />
        <View
          style={{ flex: 1, marginTop: 5 , backgroundColor: 'rgba(0,0,0,0,0)',
          position: 'absolute', left: 0, right: 0, top: (Platform.OS === 'ios') ? 120 : 110, bottom: 0, paddingTop: 5}}
        >
          <HuntFinished
            width={width}
            screenProps={this.props.screenProps}
          />
        </View>
        <AppFooter 
          width={width}
          showFooter={this.state.showFooter}
          screenProps={this.props.screenProps}
          character={character}
        />
      </SafeAreaView>
      )
    }

    if(this.props.huntQuestionData == null) {
      return (
        <Game_Loading screenProps={this.props.screenProps} />
      )
    }
    console.log('the full player challenge list is: ', this.props.playerChallengeList)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LetsRoamHeader  
          handleDrawerPress={this.props.screenProps.handleDrawerPress}
        />

        <AppHeader 
          teamName={this.props.screenProps.groupInfo.teamName}
          imageSource={{uri: this.props.screenProps.groupInfo.huntPhoto}}
          completionData={this.state.completionData} //used to calculate score
          treasureCompletionData={this.state.treasureCompletionData} // used to calculate completion score
          playerCompletionData={this.state.playerChallengeList}
        />
        <View
          style={{ flex: 1, marginTop: 5 , backgroundColor: 'rgba(0,0,0,0,0)',
          position: 'absolute', left: 0, right: 0, top: (Platform.OS === 'ios') ? 135 : 115, bottom: 95, paddingTop: 5}}
        >
        {this.state.gameView == "Location" &&

          <LocationChallenges
            completionData={this.state.completionData}
            width={width}
            screenProps={this.props.screenProps}
            updateFeedback={(feedback)=> {
              this.setState({feedback})
              }
            }
            updateCoordinates={(coordinates)=>this.setState({coordinates})}
            showMap={() => this.setState({gameView: 'Map'})}
          />
        }

        {this.state.gameView == "Treasure" &&
          <TreasureChallenges
            width={width}
            screenProps={this.props.screenProps}
            updateFeedback={(feedback)=>this.setState({feedback})}
            treasureChallenges={this.state.treasureChallenges}
            treasureCompletionData={this.state.treasureCompletionData}
          />
        }

        {this.state.gameView == "Player" &&
          <PlayerChallenges
            width={width}
            screenProps={this.props.screenProps}
            updateFeedback={(feedback)=>this.setState({feedback})}
            playerChallenges={this.state.playerChallenges}
            playerChallengeList={this.state.playerChallengeList}
          />
        }

        {this.state.gameView == "Map" &&
          <Map
            width={width}
            screenProps={this.props.screenProps}
            showLocationChallenges={() => this.setState({gameView: 'Location'})}
            coordinates={this.state.coordinates}
          />
        }

        
        
        </View>

        <AppFooter 
          feedback={this.state.feedback}
          width={width}
          showFooter={this.state.showFooter}
          completionData={this.state.completionData}
          updateGameView={(gameView) => this.setState({gameView})}
          gameView={this.state.gameView}
          screenProps={this.props.screenProps}
          character={character}
        />
        
      </SafeAreaView>
    );
  }

  //needed because the footer moves funny
  _keyboardDidShow () {
    this.setState({showFooter: false});
  }

  _keyboardDidHide () {
    this.setState({showFooter: true});
  }
};