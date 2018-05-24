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
  FlatList,
  ScrollView,
  Linking,
  SafeAreaView
} from 'react-native';
import styled from 'styled-components';
import MyText from 'react-native-letter-spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
import { List, ListItem } from "react-native-elements";
let logo = require("../../images/logo.png");
let logo3 = require("../../images/logo3.png");
import { getFacebookCredentials, facebookLogin } from "../../utils/facebook";
import google from '../../utils/google';
let { isGoogleSessionExists, getGoogleSignin } = google;
import fireUtil from '../../utils/fireUtils';
let { getUserInfo, setDataAtPath, getDataAtPath } = fireUtil;
import { getDatabase } from "../../utils/db";
import uuid from 'uuid/v4';
import moment from 'moment';
let { width, height } = Dimensions.get("window");
let containerSides = (width - 40) / 2;
import helpers from '../../utils/helpers';
let {getOpaqueColorWithChallengeType, getColorWithChallengeType} = helpers;

import GameViewNav from './GameViewNav';
import BarRouteCell from '../Registration/RouteCell';
import ChallengesScrollView from './ChallengesScrollView';
import BarRouteModal from './BarRouteModal';
import PlayerRankModal from './PlayerRankModal';
import RankCell from './RankCell'
import ChallengeCompletionModal from './ChallengeCompletionModal';

import BackButton from '../../modules/BackButton';

const Container = styled.View`
  background-color: #464D4F;
  flex: 1;
`;

//Precondition: user.currentHunt is set in firebase

export default class extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: null
    }
  };
  constructor() {
    super();

    this.state = {
      navSelected: "BAR ROUTE",
      showBarRouteModal: false,
      showPlayerRankModal: false,
      PlayerRankModalData: {},
      showChallengeCompletionModal: false,
      challengeCompletionModalData: { challengeObj: {}, challengePackId: null },
      challengeCompletionModalUserList: [],
      challengeCompletionModalUsersCompleted: [],
      barRouteModalData: {},
      barRouteModalIndex: -1,
      PlayerRankModalIndex: -1,
      loggedInUserID: " ", //done
      currentBarHuntId: 0, //id of the hunt the GameView is on
      huntBarIds: [], //extracted from the bar list - ids of bars in this hunt
      huntChallengePackIds: [], //extract from the bar list - ids of pack of challenges in this hunt
      currentStage: 0, //represent the bar position in this hunt
      huntBarOjects: [], //done the list of all bars on hunt is just equal to huntBarObjects
      allChallengePacks: [], //done the list of current challenges is equal to allChallengePacks[huntChallengePackIds[currentStage]]
      players: [], // players for this hunt
      huntCompletions: [] //all the completions for current hunt
    }

  }

  async componentDidMount() {
    //level -1 getting loggedInUserId
    let userId = await AsyncStorage.getItem("userId");
    // this.setState({ loggedInUserID: userId })
    // console.log(this.state.loggedInUserID)

    //level 0 getting currentBarHuntId
    let currentBarHuntIdRef = getDatabase().ref(`users/${userId}/currentHunt`);
    let currentBarHuntId = -1
    currentBarHuntIdRef.on("value", (snapshot) => {
      currentBarHuntId = snapshot.val()
      // this.setState({ currentBarHuntId: snapshot.val() })
      console.log('The current bar hunt is ' + currentBarHuntId)

      //level 1 getting currentStage, huntBarsId, and huntChallengePackIds
      let currentBarListRef = getDatabase().ref(`barhunt/barhunts/${currentBarHuntId}`);
      currentBarListRef.on("value", (snapshot) => {
        let playerIds = Object.keys(snapshot.val().registeredPlayers)
        let barList = snapshot.val().barList
        let currentStage = snapshot.val().currentStage
        if (!(currentStage > -1)) {
          fireUtil.setDataAtPath(`barhunt/barhunts/${currentBarHuntId}/currentStage`, 0);
          console.log('The current stage was undefined and equal to ' + currentStage)
        }

        // this.setState({ currentStage: currentStage })
        let huntBarIds = []
        let huntBarTimes = []
        let huntChallengePackIds = []

        for (let j = 0; j < barList.length; j++) {
          huntBarIds.push(barList[j].barId);
          huntBarTimes.push(barList[j].barTimes);
          huntChallengePackIds.push(barList[j].challengePackId);
        }
        this.setState({huntChallengePackIds: huntChallengePackIds});


        console.log('The playerIds are ' + playerIds)

        // this.setState({ huntBarIds: huntBarIds, huntChallengePackIds: huntChallengePackIds })
        console.log('The current stage is ' + currentStage)
        console.log('The current hunt bar Id list ' + huntBarIds)
        console.log('The current challenge pack Id List is ' + huntChallengePackIds)

        //level 2 getting huntBarOjects
        let barRef = getDatabase().ref(`barhunt`).child(`bars`);
        barRef.on("value", (snapshot) => {
          let allBars = snapshot.val()

          let huntBarOjects = []

          for (let j = 0; j < huntBarIds.length; j++) {
            let barID = huntBarIds[j];
            console.log('The ' + j + 'st/nd/rd Bar is ' + barID)
            bar = allBars.filter((bar) => {
              return bar.barId == barID;
            })
            let newBar = bar[0];
            newBar.barTimes = huntBarTimes[j];
            huntBarOjects.push(newBar);
          }
          this.setState({
            huntBarOjects: huntBarOjects
          });

          // this.setState({ huntBarOjects: huntBarOjects })
          console.log('The bars on the hunt are ' + JSON.stringify(huntBarOjects))

          //level 3 getting huntBarOjects
          let challengeRef = getDatabase().ref('barhunt').child(`challenges`);
          challengeRef.on("value", (snapshot) => {
            let allChallengePacks = snapshot.val()

            // this.setState({ allChallengePacks: challenges })
            console.log('The current challenge pack is ' + huntChallengePackIds)
            console.log('The current stage is ' + currentStage)
            console.log('The current challenge Pack is ' + huntChallengePackIds[currentStage])

            //level 4 getting players
            let playerRef = getDatabase().ref(`users`);
            playerRef.on("value", (snapshot) => {
              let allPlayers = Object.values(snapshot.val())
              console.log('All the players are ' + JSON.stringify(allPlayers))

              let players = []
              console.log('Player data is now loading')
              for (let j = 0; j < playerIds.length; j++) {
                let playerID = playerIds[j];
                player = allPlayers.filter((thePlayer) => {
                  return thePlayer.userId == playerID;
                })
                
                let newPlayer = player[0];
                newPlayer.playerIndex = j;
                newPlayer.score = 0;
                players.push(newPlayer);
              }
              // this.setState({ allChallengePacks: challenges })
              console.log('The players are ' + JSON.stringify(players));
              console.log('The current stage is being set to ' + currentStage);
              this.setState({
                loggedInUserID: userId,
                currentBarHuntId,
                currentStage,
                huntBarIds,
                huntChallengePackIds,
                huntBarOjects,
                allChallengePacks,
                players
              })

              //level 5 getting completions for the current bar hunt
              let completionsRef = getDatabase().ref(`barhunt/completions/${currentBarHuntId}`);
              completionsRef.on("value", (snapshot) => {
                if (snapshot.val() == null) {
                  this.setState({
                    huntCompletions: [],
                    challengeCompletionModalUsersCompleted: []
                  })
                  return;
                };
                let huntCompletions = Object.values(snapshot.val())

                console.log('Hi Hi')
                // recordering for score
                console.log('The number of hunt completions are' +huntCompletions.length )
                  let orderedHuntCompletions = huntCompletions.sort((a, b) => {
                    let momentA = moment(a.completionTime);
                    let momentB = moment(b.completionTime);

                    let result = momentA.isBefore(momentB);
                    
                    if (a.challengePackId == b.challengePackId && a.challengeId == b.challengeId) {
                      if (result) {
                        return -1;
                      } else {
                        return 1;
                      }
                    } else if (a.challengePackId == b.challengePackId) {
                      if (a.challengeId < b.challengeId) {
                        return -1;
                      } else {
                        return 1;
                      }
                    } else {
                      if (a.challengePackId < b.challengePackId) {
                        return -1;
                      } else {
                        return 1;
                      }
                    }
                  
                })
                console.log('The number of sorted hunt completions are' +orderedHuntCompletions.length )
                //calcualting the player scores, calculatinp oints remaining
                let lastChallengeId = -1
                let lastChallengePackId = -1
                let points = -1

                  
                //reseting the player scores to 0
                if (players.length > 0) {
                  for (let j = 0; j < players.length; j++) {
                    players[j].score = 0;
                  }
                }

                players = []
                console.log('Player data is now loading')
                for (let j = 0; j < playerIds.length; j++) {
                  let playerID = playerIds[j];
                  player = allPlayers.filter((thePlayer) => {
                    return thePlayer.userId == playerID;
                  })
                  
                  let newPlayer = player[0];
                  newPlayer.playerIndex = j;
                  newPlayer.score = 0;
                  newPlayer.completedChallenges = [];
                  players.push(newPlayer);
                }

                //resetting completions to 0
                for (let j = 0; j < orderedHuntCompletions.length; j++) {
                  allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].completionCount = 0;
                  console.log('the completion count was reset')
                }

                for (let j = 0; j < orderedHuntCompletions.length; j++) {
                  if (orderedHuntCompletions[j].challengeId == lastChallengeId && orderedHuntCompletions[j].challengePackId == lastChallengePackId) {
                    points = Math.max(points - 1, 1);
                    allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].completionCount = allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].completionCount + 1;
                  } else {
                    points = allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].challengeMaxPoints;
                    allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].completionCount = 1;
                  }


                  //setting points remaining for challenge
                  allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].pointsRemaining = points;

                  orderedHuntCompletions[j].score = points
                  
                  let player = players.filter((thePlayer) => {
                    return thePlayer.userId == orderedHuntCompletions[j].userId;
                  })
                  
                  let playerIndex = playerIds.indexOf(orderedHuntCompletions[j].userId);
                  console.log('the players are being logged')
                  console.log(playerIndex)
                  console.log(orderedHuntCompletions[j].userId)
                  console.log('The challenge pack id is' + orderedHuntCompletions[j].challengePackId)
                  console.log('The challenge  id is' + orderedHuntCompletions[j].challengeId)
                  if (playerIndex == -1) {
                    console.log('There is a completion without a user id with the id' + orderedHuntCompletions[j].userId)
                  }
                  else if (players[playerIndex].score > 0) {
                    players[playerIndex].score= points + players[playerIndex].score
                  } 
                  else {
                    players[playerIndex].score = points
                  }
                  let newCompletedChallenge = {
                    points,
                    challengeTitle: allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].challengeTitle,
                    challengeText: allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].challengeText,
                    challengeType: allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].challengeType,
                    challengeBarId: huntBarIds[huntChallengePackIds.indexOf(orderedHuntCompletions[j].challengePackId)],
                    challengeBarImage: huntBarOjects[huntChallengePackIds.indexOf(orderedHuntCompletions[j].challengePackId)].barImageName

                  };
                  console.log(newCompletedChallenge);
                  players[playerIndex].completedChallenges.push(newCompletedChallenge);

                  //setting the first completor photo url
                  if (orderedHuntCompletions[j].challengeId != lastChallengeId || orderedHuntCompletions[j].challengePackId != lastChallengePackId) {
                    allChallengePacks[orderedHuntCompletions[j].challengePackId][orderedHuntCompletions[j].challengeId].completorPhotoUrl = players[playerIndex].photoUrl;
                  }

                  lastChallengeId = orderedHuntCompletions[j].challengeId;
                  lastChallengePackId = orderedHuntCompletions[j].challengePackId
                }
                
                console.log('player '+ players[0].firstName+ ' challenge is')
                console.log(Object.values(players[0].completedChallenges))

                console.log('Ordered completions are ')
                console.log(JSON.stringify(orderedHuntCompletions))

                console.log('The scored players ')
                console.log(JSON.stringify(players))

                console.log('All challenge packs are ')
                console.log(JSON.stringify(allChallengePacks))
                
                this.setState({
                  loggedInUserID: userId,
                  currentBarHuntId,
                  currentStage,
                  huntBarIds,
                  huntChallengePackIds,
                  huntBarOjects,
                  allChallengePacks,
                  players,
                  huntCompletions,
                })

                if (this.state.challengeCompletionModalData.challengeObj != null) {
                  this.updateChallengeCompletionModalUsersCompleted(this.state.challengeCompletionModalData.challengeObj.challengeId, this.state.challengeCompletionModalData.challengeObj.challengePackId);
                }
                this.updateChallengeCompletionModalUserList();

              })

            })
          })
        })
      })
    })

  }

  updateChallengeCompletionModalUsersCompleted = async (challengeId, challengePackId) => {

    // update players completed for this challenge
    // with huntCompletions, filter those with this challenge id
    let completionsForThisChallenge = this.state.huntCompletions.filter((completion) => {
      return completion.challengeId == challengeId && completion.challengePackId == challengePackId;
    })

    // then get user object for those completions for this challenge
    let userWithCompletionObjects = []; // each obj contains the user and completion object
    for (let i = 0; i < completionsForThisChallenge.length; i++) {
      let currentCompletion = completionsForThisChallenge[i];
      let userId = currentCompletion.userId;
      // get the user object from firebase
      let userObj = await getDataAtPath(`users/${userId}`);
      userWithCompletionObjects.push({
        userObj: userObj,
        completionObj: currentCompletion
      });
    }

    // recorder based on time
    userWithCompletionObjects = userWithCompletionObjects.sort((a, b) => {
      let momentA = moment(a.completionObj.completionTime);
      let momentB = moment(b.completionObj.completionTime);

      let result = momentA.isBefore(momentB);

      if (result) {
        return -1;
      } else {
        return 1;
      }
    })

    // each object in this array has two key: userObj and completionObj
    // console.log(`here is an log for obj`);
    // console.log(usersCompleted);
    this.setState({ challengeCompletionModalUsersCompleted: userWithCompletionObjects });

  }

  updateChallengeCompletionModalUserList = () => {

    // update users list
    let users = [];

    users = this.state.players.filter((user) => {
      // not show self
      // not show users who completed this challenge already
      if (user.userId == this.state.loggedInUserID) return false;
      // if I can find user.userId in this.state.challengeCompletionModalUsersCompleted, return false
      let found = this.state.challengeCompletionModalUsersCompleted.find((userCompleted) => {
        if (userCompleted.userObj.userId == user.userId) return true;
        else return false;
      })

      if (found === undefined) { // not found
        return true
      }
      else {
        return false
      };
    })

    this.setState({
      challengeCompletionModalUserList: users
    })

  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    let { loggedInUserID,
      currentBarHuntId,
      huntBarIds, huntChallengePackIds,
      currentStage, huntBarOjects, players,
      allChallengePacks } = this.state;

    let currentChallengePackId = huntChallengePackIds[currentStage];
    let challengesObjects = allChallengePacks[huntChallengePackIds[currentStage]];

    if (challengesObjects != null) {
      for (let j = 0; j < challengesObjects.length; j++) {
        if (challengesObjects[j].completorPhotoUrl == null) {
          console.log('the completor photo url was null')
          if (challengesObjects[j].challengeType == 'tournament') {
            challengesObjects[j].completorPhotoUrl = "https://www.scavengerhunt.com/images/trophy.png"
          } else if (challengesObjects[j].challengeType == 'completion') {
            challengesObjects[j].completorPhotoUrl = "https://www.scavengerhunt.com/images/flag.png"
          } else {
            challengesObjects[j].completorPhotoUrl = "https://www.scavengerhunt.com/images/photo-icon.png"
          }
          console.log(challengesObjects[j].completorPhotoUrl)
        }
        if (challengesObjects[j].completionCount == null) {
          challengesObjects[j].completionsRemaining = challengesObjects[j].challengeMaxCompletions;
        } else {
          challengesObjects[j].completionsRemaining = challengesObjects[j].challengeMaxCompletions - challengesObjects[j].completionCount;
        }

        if (challengesObjects[j].pointsRemaining == null) {
          challengesObjects[j].pointsPossible = challengesObjects[j].challengeMaxPoints;
        } else if (challengesObjects[j].completionsRemaining == 0)  {
          challengesObjects[j].pointsPossible = ''
        } else {
          challengesObjects[j].pointsPossible = Math.max(challengesObjects[j].pointsRemaining - 1, 1);
        }
      }
    }

    console.log('The current challenges for the stage are')
    console.log(currentStage)

    let rankedPlayers = [];
    if (this.state.players.length > 0) {
      let unsortedPlayers = this.state.players;
      rankedPlayers = Object.values(unsortedPlayers.sort((a, b) => {
        return a.score > b.score ? -1 : 1;
      }))
      let rank = -1;
      let rankBuildUp = 0
      let previousScore = -1; 
      for (let j = 0; j < rankedPlayers.length; j++) {
        if (rankedPlayers[j].score == previousScore) {
          rankedPlayers[j].playerRank = rank;
          rankBuildUp = rankBuildUp + 1;
        } else {
          rank = rank + rankBuildUp + 1;
          rankedPlayers[j].playerRank  = rank;
          rankBuildUp = 0;
        }
      }
    }
    console.log("The ranked players are ")
    console.log(rankedPlayers)

    
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#464D4F'}}>
        <Container  style={{ flex: 1, marginTop: (Platform.OS === 'ios') ? 0 : 20 }}>
          <BarRouteModal
            changeBarHandler={async () => {
              console.log('The change bar handler fired')
              await fireUtil.setDataAtPath(`barhunt/barhunts/${currentBarHuntId}/currentStage`, this.state.barRouteModalIndex);
              this.setState({ showBarRouteModal: false, navSelected: "CHALLENGES" });
            }}
            show={this.state.showBarRouteModal}
            data={this.state.barRouteModalData}
            handleClose={() => {
              this.setState({ showBarRouteModal: false })
            }}
          />
          <PlayerRankModal
            show={this.state.showPlayerRankModal}
            data={this.state.PlayerRankModalData}
            handleClose={() => {
              this.setState({ showPlayerRankModal: false })
            }}
          />

          <ChallengeCompletionModal
            show={this.state.showChallengeCompletionModal}
            data={this.state.challengeCompletionModalData}
            userId={this.state.loggedInUserID}
            barHuntId={this.state.currentBarHuntId}
            completionHandler={async (completionObj) => { // press on a user on the list
              // get the completion object and send it firebase
              await setDataAtPath(`barhunt/completions/${this.state.currentBarHuntId}/${completionObj.id}`, completionObj);

              // update users completed
              await this.updateChallengeCompletionModalUsersCompleted(completionObj.challengeId, completionObj.challengePackId);

              this.updateChallengeCompletionModalUserList();
            }}
            savePhotoVideoTypeChallengeCompletionHandler={async (completionObj) => {
              await setDataAtPath(`barhunt/completions/${this.state.currentBarHuntId}/${completionObj.id}`, completionObj);
            }}
            usersCompleted={this.state.challengeCompletionModalUsersCompleted}
            userList={this.state.challengeCompletionModalUserList}
            handleClose={() => {
              this.setState({ showChallengeCompletionModal: false })
            }}
          />

         

          <GameViewNav
            selected={this.state.navSelected}
            barRoutePressed={() => {
              this.setState({ navSelected: "BAR ROUTE" })
            }}
            rankPressed={() => {
              this.setState({ navSelected: "RANK" })
            }}
            challengesPressed={() => {
              this.setState({ navSelected: "CHALLENGES" })
            }}
          />

           <BackButton
            onPress={() => {
              goBack();
            }}
          />

          {this.state.navSelected == "BAR ROUTE" && this.state.huntBarOjects.length > 0 &&
            <FlatList
              style={{ marginTop: 30 }}
              data={this.state.huntBarOjects}
              keyExtractor={(item, index) => String(item.barId)}
              renderItem={({ item, index }) => {
                return (
                  <BarRouteCell
                    onPress={() => {
                      this.setState({
                        showBarRouteModal: true,
                        barRouteModalData: item,
                        barRouteModalIndex: index
                      });
                      console.log('the players rank is');
                      console.log(this.state.PlayerRankModalIndex)
                    }}
                    item={item}
                    index={index}
                  />
                )
              }}
            />
          }

          {(this.state.navSelected == "CHALLENGES" && allChallengePacks.length > 0) &&
            <List containerStyle={{ flex: 1, backgroundColor: 'white' }}>
              <FlatList 
                key={this.state.huntCompletions}
                data={challengesObjects.sort((a, b) => {                
                  if (a.completionsRemaining == 0 && b.completionsRemaining == 0) {
                    if (a.challengeId > b.challengeId) {
                      return 1
                    }
                    else {
                      return -1
                    }
                  } else if (a.completionsRemaining == 0 && b.completionsRemaining > 0){
                    return 1
                  } else if (a.completionsRemaining > 0 && b.completionsRemaining == 0){
                    return -1
                  } else {
                    if (a.challengeId > b.challengeId) {
                      return 1
                    }
                    else {
                      return -1
                    }
                  }
                
              })}
                renderItem={({ item }) => (
                  <ListItem
                    key={this.state.huntCompletions}
                    //roundAvatar, , completorPhotoUrl
                    roundAvatar
                    avatar={{uri: item.completorPhotoUrl }}
                    containerStyle={{ backgroundColor:  '#D9D9D6' }}
                    rightIcon={
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 28, marginRight: 3, marginBottom: 3, color: '#E87722'}}>{item.pointsPossible}</Text>
                        <Image
                          style={{ height: 26, width: 20 }}
                          source={require('../../images/orange_fox.png')}
                        />
                      </View>
                    }
                    //containerStyle={{ borderBottomColor:  getColorWithChallengeType(item.challengeType) }}
                    underlayColor={'black'}
                    title={item.challengeTitle}
                    subtitle={ item.challengeText+ '\n' + (item.challengeMaxCompletions) + ' '  + (item.completionCount) + ' ' + (item.challengeMaxCompletions - item.completionCount)  + ' Completions Left'}
                    titleStyle ={[{color: getColorWithChallengeType(item.challengeType), color:'#E87722', fontFamily: 'Alternate Gothic No3 D', fontWeight: '500'}, item.completionsRemaining == 0 && {textDecorationLine: 'line-through'} ]}
                    subtitleStyle ={[{color: getColorWithChallengeType(item.challengeType), color:'#505759', fontFamily: 'CircularStd-Black'}, item.completionsRemaining == 0 && {textDecorationLine: 'line-through'} ]}
                    subtitleNumberOfLines={0}
                    // titleStyle ={[{color: getColorWithChallengeType(item.challengeType), fontWeight: 'bold'}, item.completionsRemaining == 0 && {textDecorationLine: 'line-through'} ]}
                    // subtitleStyle ={{color: getColorWithChallengeType(item.challengeType) }}
                    
                    onPress={async() => {
                          this.setState({
                          showChallengeCompletionModal: true,
                          challengeCompletionModalData: {
                              challengeObj: item,
                              challengePackId: this.state.huntChallengePackIds[this.state.currentStage]
                              }
                          })
                          console.log(this.state.challengeCompletionModalData);
                          await this.updateChallengeCompletionModalUsersCompleted(item.challengeId, this.state.huntChallengePackIds[this.state.currentStage]);
                          this.updateChallengeCompletionModalUserList();
                        }}
                    //avatar={{ uri: item.picture.thumbnail }}
                  />
                )}
              />
          </List>
          }
          
          {(this.state.navSelected == "RANK" && players.length > 0) &&
            <FlatList
              style={{ marginTop: 30, marginLeft: 30, marginRight: 30 }}
              
              data={this.state.players}
              keyExtractor={(item, index) => String(item.firstName)}
              renderItem={({ item, index }) => {
                return (
                  <RankCell
                    onPress={() => {
                      this.setState({
                        showPlayerRankModal: true,
                        PlayerRankModalData: item
                      });
                    }}
                    item={item}
                    index={index}
                  />
                )
              }}
            />
          }

        </Container>
      </SafeAreaView>
    );
  }
}
