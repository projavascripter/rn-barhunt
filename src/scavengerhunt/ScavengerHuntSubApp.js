import React, { Component } from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import getCurrentRouteName from 'react-navigation-current-route';
import { Text, View, Alert, SafeAreaView, Platform, AsyncStorage } from 'react-native'
import Registration from './registration/Registration';
import styled from 'styled-components';
import MainGame from './game/MainGame';
import { getDatabase } from "../utils/db";
//  import Role from './roles/Role';
import './global.js';

//importing firebase to the subapp
 import fireUtil from '../utils/fireUtils';
 let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;
 import uuid from 'uuid/v4';

import axios from 'axios';

//defining redux
import { connect } from 'react-redux';

class SubApp extends Component {
  state = {
    //auth_code: null,
    auth_code: null,
    find_hunt_url: '',
    selectedHunt: '',
    huntQuestionData: null,
    huntQuestionDataRequested: false,
    locationPermissionRequested: false,
    groupInfo: null,
    allAuthCodes: null
  }

  async createScavengerHunt(selectedHunt) {
    let groupId = uuid()
    console.log('the group id is ' + groupId)
    let playerObject = {};
    playerObject[this.props.user.info.userId] = {userId: this.props.user.info.userId, photoUrl: this.props.user.info.photoUrl, firstName: this.props.user.info.firstName}
    let groupObject =
    {
      groupId,
      accessCode: 'Mike',
      teamName: selectedHunt.teamName,
      prePaidPlayers: selectedHunt.prePaidPlayers-1,
      eventDate: selectedHunt.eventDate,
      huntId: selectedHunt.hunt_id,
      theme: selectedHunt.theme,
      huntPhoto: selectedHunt.huntLargePhotoURL, //can be edited for corporate groups
      completionData: null,
      huntStarted: false,
      players: playerObject,
      huntName: selectedHunt.name,
      huntCity: selectedHunt.city,
      dateTimeEventCreated: Date.now(),
      startingLocation: selectedHunt.starting_location
    }
    console.log('the group object is')
    console.log(groupObject)
    await setDataAtPath(`users/${this.props.user.info.userId}/currentScavengerHuntGroupId`, groupId);
    await setDataAtPath(`scavengerhunt/groups/${groupId}`, groupObject);
    this.setState({ auth_code: uuid(), groupInfo: groupObject })
}

async joinEvent(authCode) {
  let groupId = authCode
  console.log('the group id is ' + groupId)
  let playerObject = {userId: this.props.user.info.userId, photoUrl: this.props.user.info.photoUrl, firstName: this.props.user.info.firstName}
  await setDataAtPath(`users/${this.props.user.info.userId}/currentScavengerHuntGroupId`, groupId);
  await setDataAtPath(`scavengerhunt/groups/${groupId}/players/${this.props.user.info.userId}`, playerObject);
  let groupObject = await getDataAtPath(`scavengerhunt/groups/${groupId}`)
  this.setState({ auth_code: authCode, groupInfo: groupObject })
}

async makeHuntLive(groupId) {
  console.log('the hunt is being made live')
  await setDataAtPath(`scavengerhunt/groups/${groupId}/huntStarted`, true);
  await setDataAtPath(`scavengerhunt/groups/${groupId}/huntStartTime`, Date.now());
}

async finishHunt() {
  let groupId = this.state.groupInfo.groupId  
  await setDataAtPath(`scavengerhunt/groups/${groupId}/huntFinished`, true);
  await setDataAtPath(`scavengerhunt/groups/${groupId}/huntFinishTime`, Date.now());
}




  async updateAuthCode(auth_code) {
    if (auth_code != null) {
      console.log('the previous hunt auth code is ' + auth_code)
      let groupInfo = await getDataAtPath(`scavengerhunt/groups/${auth_code}`);
      console.log('the hunt id for the past hunt is ' + groupInfo.huntId)
      this.setState({ auth_code, huntQuestionDataRequested: false, groupInfo })
    } else {
      this.setState({ auth_code, huntQuestionDataRequested: false, groupInfo: null })
    }
}


  async startLightningTimer() {
    let groupId = this.state.groupInfo.groupId
    await setDataAtPath(`scavengerhunt/groups/${groupId}/lightningRoundStartTime`, Math.floor(Date.now() / 1000));
}
async createCompletionEvent(guess, questionNumber, pointsEarned, correctAnswer, questionType, lightningRoundBonusPoints) {
  console.log('the saved question type is')
  console.log(questionType)
  let completionId = uuid()
  let completionObject =
  {
    completionId ,
    completingUserId: this.props.user.info.userId,
    guess: guess,
    questionNumber,
    completionTime: Math.floor(Date.now() / 1000),
    pointsEarned,
    correctAnswer,
    questionType,
    lightningRoundBonusPoints
  }
  await setDataAtPath(`scavengerhunt/locationCompletions/${this.state.auth_code}/${completionId}`, completionObject);
  if ((typeof guess != 'number' ? guess.toLowerCase() : guess) == (typeof correctAnswer != 'number' ? correctAnswer.toLowerCase() : guess)) {
    let groupId = this.state.groupInfo.groupId
    await setDataAtPath(`scavengerhunt/groups/${groupId}/lightningRoundStartTime`, null);
  }
}





async createTreasureCompletionEvent(selectedChallengeIndex, selectedChallengeId, title, pointsEarned, imagePath, downloadURL) {
  console.log('the async function is firing')
  let completionId = uuid()
  let completionObject =
  {
    completionId ,
    completingUserId: this.props.user.info.userId,
    selectedChallengeIndex,
    selectedChallengeId,
    completionTime: Math.floor(Date.now() / 1000),
    title,
    pointsEarned,
    imagePath,
    downloadURL,
  }
  console.log('the completion object is'); console.log(completionObject)
  await setDataAtPath(`scavengerhunt/treasureCompletions/${this.state.auth_code}/${completionId}`, completionObject);
}

async setUserReview(data) {

  let reviewObject =
  {
    r_hunt: data.r_hunt,
    r_app: data.r_app,
    r_role: data.r_role
  }
  await setDataAtPath(`scavengerhunt/groups/${this.state.auth_code}/players/${data.user_id}/reviews`, reviewObject);
}

async completeTriviaChallenge(data) {
  let userId = this.props.user.info.userId
  let groupId = this.state.groupInfo.groupId
  let path = `scavengerhunt/playerChallengeList/${groupId}/${userId}/${data.selectedChallenge.challengeId}`
  let triviaObject = await getDataAtPath(`scavengerhunt/playerChallengeList/${groupId}/${userId}/${data.selectedChallenge.challengeId}`)
  triviaObject.pointsEarned = data.correct == "true" ? 50 : 0
  triviaObject.guess = data.option
  triviaObject.correctAnswer = data.correctAnswer
  triviaObject.completionTime = Math.floor(Date.now()/1000)
  await setDataAtPath(`scavengerhunt/playerChallengeList/${groupId}/${userId}/${data.selectedChallenge.challengeId}`, triviaObject);
}

async completePhotoChallenge(selectedChallenge) {
  let userId = this.props.user.info.userId
  let groupId = this.state.groupInfo.groupId
  let path = `scavengerhunt/playerChallengeList/${groupId}/${userId}/${selectedChallenge.challengeId}`
  let photoObject = await getDataAtPath(`scavengerhunt/playerChallengeList/${groupId}/${userId}/${selectedChallenge.challengeId}`)
  photoObject.pointsEarned = 50
  photoObject.photoURL = selectedChallenge.downloadURL
  photoObject.completionTime = Math.floor(Date.now()/1000)
  await setDataAtPath(`scavengerhunt/playerChallengeList/${groupId}/${userId}/${selectedChallenge.challengeId}`, photoObject);
}

async selectCharacter(character) {
  console.log('The following character was selected', character)
  console.log('The auth code is', this.state.groupInfo.groupId)
  console.log('The user id is', this.props.user.info.userId)
  await setDataAtPath(`scavengerhunt/groups/${this.state.groupInfo.groupId}/players/${this.props.user.info.userId}/character`, character);
}


async setBonusReview(data) {

  let reviewObject =
  {
    r_hunt: data.r_hunt,
    r_app: data.r_app,
    r_role: data.r_role
  }
  await setDataAtPath(`scavengerhunt/groups/${this.state.auth_code}/players/${data.user_id}/reviews/facebookReview`, data.facebookReview);
  await setDataAtPath(`scavengerhunt/groups/${this.state.auth_code}/players/${data.user_id}/reviews/googleReview`, data.googleReview);
  await setDataAtPath(`scavengerhunt/groups/${this.state.auth_code}/players/${data.user_id}/reviews/bonusReviewDone`, true);
}


  async componentDidMount() {
    let groupReference = getDatabase().ref(`scavengerhunt/groups`);
    groupReference.on("value", (snapshot) => {
      console.log('This totally fired')
      let allGroups = snapshot.val()
      if (allGroups != null) {
        allGroups = this.objectValues(snapshot.val())
        let allAuthCodes = allGroups.map((group) => { 
          return group.groupId
        })
        
        if (allAuthCodes != this.state.allAuthCodes) {
          this.setState({ allAuthCodes})
        }
      }
    });
    let groupId = this.props.screenProps.groupInfo.groupId
    if (groupId != null) {

    }
    

    groupReference.on("value", (snapshot) => {
      console.log('This totally fired')
      let allGroups = snapshot.val()
      if (allGroups != null) {
        allGroups = this.objectValues(snapshot.val())
        let allAuthCodes = allGroups.map((group) => { 
          return group.groupId
        })
        
        if (allAuthCodes != this.state.allAuthCodes) {
          this.setState({ allAuthCodes})
        }
      }
    });
  }
  objectValues = (object) => {
    if (object != null) {
      if (object.groupId == null) {
        console.log('the evaluated object is: '); console.log(object)
        return Object.values(object)
      }
    }
    return object
  }

    
  render() {
    // if (1 === 2) {
    //   return <Role />
    // }
    let props = {
      data: "data",
      auth_code: this.state.auth_code,
      completionData: this.state.completionData,
      user: this.props.user,
      groupInfo: this.state.groupInfo,
      allAuthCodes: this.state.allAuthCodes,
      handleOnPress: () => {
        console.log('The go back call back was activated');
        this.props.navigation.goBack();
      },
      handleSignInPress: this.props.screenProps.handleSignInPress,
      handleDrawerPress: () => {
        console.log('The drawer button was pressed');
        this.props.navigation.navigate('DrawerToggle');
      },
      updateAuthCode: (auth_code) => {
        this.updateAuthCode(auth_code)
      },
      joinEvent: (auth_code) => {
        this.joinEvent(auth_code)
      },
      makeHuntLive: (groupId) => {
        this.makeHuntLive(groupId)
      },
      selectCharacter: (character) => {
        this.selectCharacter(character)
      },
      finishHunt: () => {
        this.finishHunt()
      },
      updateHuntData: (huntQuestionData) => {
        this.setState({ huntQuestionData })
      },
      createScavengerHunt: (selectedHunt) => {
        this.createScavengerHunt(selectedHunt)
      },
      firebaseUpdateGroupInfo: (groupInfo) => {
        this.setState({ groupInfo, auth_code: groupInfo.groupId })
      },
      firebaseUpdateCompletionData: (completionData) => {
        this.setState({ completionData })
      },
      setUserReview: (data) => {
        this.setUserReview(data)
      },
      setBonusReview: (data) => {
        this.setBonusReview(data)
      },
      createCompletionEvent: (guess, correctAnswer, questionNumber, pointsEarned, questionType, lightningRoundBonusPoints) => {
        this.createCompletionEvent(guess, correctAnswer, questionNumber, pointsEarned, questionType, lightningRoundBonusPoints)
      },
      completeTriviaChallenge: (item) => {
        this.completeTriviaChallenge(item)
      },
      completePhotoChallenge: (item) => {
        this.completePhotoChallenge(item)
      },
      createTreasureCompletionEvent: (selectedChallengeIndex, selectedChallengeId, title, pointsEarned, imagePath, downloadURL) => {
        console.log('the screen prop is firing')
        this.createTreasureCompletionEvent(selectedChallengeIndex, selectedChallengeId, title, pointsEarned, imagePath, downloadURL)
      },
      startLightningTimer: () => {
        this.startLightningTimer()
      },
     
    };

    console.log('the auth code state is' + this.state.auth_code);
    console.log('the hund question request state is' + this.state.huntQuestionDataRequested);




    if (this.state.auth_code !== null) {
      return <MainGame huntQuestionData={this.state.huntQuestionData} screenProps={props} />;
    }

    if (this.state.auth_code === null || this.state.auth_code == '') {
      return (
        <SafeAreaView style={{ flex: 1 }} key={this.state.auth_code}>
          <View style={{ flex: 1, marginTop: (Platform.OS === 'ios') ? 0 : 0 }} >
            <Registration
              screenProps={props}
              key={this.selectedHunt}
              onNavigationStateChange=
              {(currentState) => { global.selectedHunt = (getCurrentRouteName(currentState) !== 'FindHunt' ? '' : global.selectedHunt); }} />
          </View>
        </SafeAreaView>

      )
    }
    // return <Game />;
    return <View />
  }
}

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
}

//defining the actions that I want available for this component
//need to import the actions from the action folder in order to use
const actions = { };

//assigning the property and the actions to the component
//how redux connects to the component
export default SubApp = connect(mapStateToProps, actions)(SubApp);