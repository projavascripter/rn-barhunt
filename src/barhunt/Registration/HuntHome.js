// Show hunt list so that the user can register or join

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  AsyncStorage,
  FlatList,
  TextInput,
  Platform,
  StatusBar
} from 'react-native';
import styled from 'styled-components';
import MyText from 'react-native-letter-spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../../images/logo.png");
let logo3 = require("../../images/logo3.png");
import google from '../../utils/google';
let { isGoogleSessionExists, getGoogleSignin } = google;
import fireUtil from '../../utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;
import { getDatabase } from "../../utils/db";
import uuid from 'uuid/v4';
import moment from 'moment';
import Color from 'color'
import LoginModal from '../../LandingPage/NewLoginModal'

let { width, height } = Dimensions.get("window");

import BarHuntInfoModal from '../../modules/InfoModal';
import BarHuntList from './HuntList';
import BarHuntHomeNav from './HuntHomeNav';
import PrivateSection from './PrivateSection';
import BarHuntDetailModal from './HuntDetailModal';

import BackButton from '../../modules/BackButton';
import QuestionMarkButton from '../../modules/QuestionMarkButton';

import BarHuntCell from './BarHuntCell';
import SmallButton from '../../modules/HomeSmallButton';

import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';

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

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default class extends Component {

  static navigationOptions = {
    header: null
  };

  constructor() {
    super();

    this.state = {
      showBarHuntInfoModal: false,
      showBarHuntDetailModal: false, // test
      barHuntDetailModalData: {},
      barHuntData: [],
      barHuntTemplate: [],
      barHuntDataFiltered: [],
      navSelected: "PUBLIC",
      userId: '',
      allHuntData: [],
      showCreateBarCrawl: false,
      createBarCrawlData: {eventName: null, eventId: null, eventMustBeSearched: null, eventDate: null},
      voucherInputText: "",
      currentUser: null,
      showFindFriendBarCrawl: false,
      findFriendBarCrawlData: null,
      huntDetailModalActionText: null,
      showLoginModal: false
    }
  }

  async componentDidMount() {

    // connect to firebase and get data
    let userId = await AsyncStorage.getItem("userId");


    // for each hunt event, check if the current user is in the registeredPlayer
    let ref = getDatabase().ref('barhunt').child('barhunts');

    ref.on("value", async (snapshot) => {
      let myHuntIds = [];

      // console.log(`here is an var activ`);
      let allHunts = snapshot.val(); // all bar hunts publiccally available
      console.log('The bar hunt data for the flat list is: ');
      console.log(allHunts);

      let objectAllHunts = Object.values(allHunts);
      for (let i = 0; i < objectAllHunts.length; i++) {
        let currentHunt = objectAllHunts[i];
        let currentHuntId = currentHunt.id;

        if (typeof currentHunt.registeredPlayers == 'undefined') {
          continue;
        }
        let registeredPlayerIds = Object.keys(currentHunt.registeredPlayers);
        

        for (let i = 0; i < registeredPlayerIds.length; i++) {
          let currentRegisteredPlayerId = registeredPlayerIds[i];
          if (currentRegisteredPlayerId == userId) {
            myHuntIds.push(currentHuntId);
          }
        }
      }
      console.log('the list of the hunt object ids for the filtered list is: ')
      console.log(myHuntIds)

      // get hunt items for each hunt id
      let myHuntObjs = await getHuntObjWithIds(myHuntIds);

      this.setState({ barHuntDataFiltered: myHuntObjs, barHuntData: allHunts, userId, allHuntData: allHunts });

      if (this.state.barHuntDetailModalData.id != null && userId != null) {
        console.log('the modal text should be updated for hunt_id' + this.state.barHuntDetailModalData.id)
        console.log('The hunt object is ')
        console.log(Object.values(allHunts));
        let huntObj = Object.values(allHunts).find((item) => {
          return item.id == this.state.barHuntDetailModalData.id
        })
        console.log('The selected hunt object is:');
        console.log(huntObj);
        // check if current user is in its registeredPlayers
        let registeredPlayersArr = Object.keys(huntObj.registeredPlayers);
        let result = registeredPlayersArr.indexOf(userId);
        console.log('The index of the selected hunt is: ');
        console.log(result)
        if (result < 0) { // user not regisgered for this hunt
          console.log('The hunt detail modal text was set to register');
          this.setState({ huntDetailModalActionText: "Register" });
        } else {
          console.log('The hunt detail modal text was set to join/play now');
          this.setState({ huntDetailModalActionText: "Join/Play Now" });
        }
      }
      
      //edithere
    });

    // for each hunt event, check if the current user is in the registeredPlayer
    let refTemplate = getDatabase().ref('barhunt').child('barhunttemplates');

    refTemplate.on("value", async (snapshot) => {

      // console.log(`here is an var activ`);
      let barHuntTemplate = snapshot.val(); // all bar hunts publiccally available

      this.setState({ barHuntTemplate:barHuntTemplate });
    });

    //getting the current user data
    let refUser = getDatabase().ref('barhunt').child(`users/${userId }`);
    refUser.on("value", async (snapshot) => {

      // console.log(`here is an var activ`);
      let currentUser = snapshot.val(); // all bar hunts publiccally available

      this.setState({ currentUser:currentUser });
    });


  }

  // update the hunt detail modal action button text
  upateModalActionText = (huntId) => {

    // check if the user has registered for this hunt or not
    // if it does, set to "Join"
    // if it doesn't, set to "Register"

    // get current user's id

    let isRegistered = this.isUserRegisteredForHunt(this.state.userId, huntId, this.state.barHuntData);
    if (!isRegistered) { // user not regisgered for this hunt
      this.setState({ huntDetailModalActionText: "Register" });
    } else {
      this.setState({ huntDetailModalActionText: "Join/Play Now" });
    }

  }

  // can be refactored to helper
  isUserRegisteredForHunt = (userId, huntId, huntObjArr) => {
    // find the hunt object in the state with the id
    console.log('The hunt object is ')
    console.log(huntObjArr);
    let huntObj = huntObjArr.find((item) => {
      return item.id == huntId
    })

    // check if current user is in its registeredPlayers
    let registeredPlayersArr = Object.keys(huntObj.registeredPlayers);
    let result = registeredPlayersArr.indexOf(userId);
    console.log('The selected hunt object is');
    let newHuntObject = this.state.allHuntData[huntId];
    console.log(newHuntObject);
    if (result < 0) { // user not regisgered for this hunt
      return false;
    } else {
      return true;
    }

  }

  // handle question mark button click
  handleQuestionMarkPress = () => {
    this.setState({ showBarHuntInfoModal: true });
  }

  // handling joining a hunt
  // huntId - the id of the hunt
  joinHunt = async (huntId) => {
    let { navigate } = this.props.navigation;

    // update firebase db for this user
    // update the current hunt id in the user
    let userId = await AsyncStorage.getItem("userId");
    await setDataAtPath(`users/${userId}/currentHunt`, huntId);

    // navigate to GameView
    navigate("GameView");

    // dismiss the detail modal
    this.setState({ showBarHuntDetailModal: false });
  }

  // put the user's id in the hunt's object in firebase
  registerUserForHunt = async (userId, huntId) => {
    // register this player
    await setDataAtPath(
      `barhunt/barhunts/${huntId}/registeredPlayers/${userId}`,
      true
    );

  }

  openDetailModal = async (item) => {

    // store the item in this's state
    // show the hunt detail modal
    this.setState({
      barHuntDetailModalData: item,
      showBarHuntDetailModal: true
    }, async () => {
      console.log('The selected hunt Id is' + item.id)

        // find the hunt object in the state with the id
        let selectedBarHuntData = Object.values(this.state.barHuntData).find((barhunt) => {
          return barhunt.id == item.id
        })
        console.log('The selected hunt data is');
        console.log(selectedBarHuntData);
    

        //if you change the hunt modal text, make sure to change the logic in handleDetailModalAction!!!!!
        if(this.state.userId == null) { //if the user is not logged in
          this.setState({ huntDetailModalActionText: "Please Log In" });
        } else { // if the user is logged in

          if(selectedBarHuntData.registeredPlayers == null) {
            this.setState({ huntDetailModalActionText: "Register" });
          } else {
            let registeredPlayersArr = Object.keys(selectedBarHuntData.registeredPlayers);
            let result = registeredPlayersArr.indexOf(this.state.userId);
            if (result < 0) { // user not regisgered for this hunt
              this.setState({ huntDetailModalActionText: "Register" });
            } else {
              this.setState({ huntDetailModalActionText: "Join/Play Now" });
            }
          }
        }
      });
        

  }

  handleLoginModal = () => {
    setTimeout(this.setState({showLoginModal: true}, 100))
  }

  handleDetailModalAction = async () => {
    let huntId = this.state.barHuntDetailModalData.id;

    // if user has not logged yet, go back to home screen and show login modal
    if (this.state.userId == null) {
      this.props.navigation.goBack()
    } else if (this.state.huntDetailModalActionText == "Register") { // user not regisgered for this hunt
      // if he/she hasn't
      // register
      await this.registerUserForHunt(this.state.userId, huntId);
      console.log('The modal action hunt id is' )
      // update button text
      await this.upateModalActionText(huntId);

    } else {
      // if already registered
      // go to GameView
      //  console.log(`here is an var go to gameview`);
      await this.joinHunt(huntId);
    }
  }
  
  render() {
    let { goBack, navigate } = this.props.navigation;
    let { width, height } = Dimensions.get("window");

    let data = [{
      value: 'Banana',
    }, {
      value: 'Mango',
    }, {
      value: 'Pear',
    }]
    const Moment = require('moment');
    const MomentRange = require('moment-range');
    const moment = MomentRange.extendMoment(Moment);

    const start = moment()
    const end = moment().add(3, 'months')
    const range = moment.range(start, end)
    const arrayOfDates = Array.from(range.by('days'))
    console.log('The filtered registered hunt list is: ');
    console.log(this.state.barHuntDataFiltered);
    return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#464D4F'}}>
      <Container style={{marginTop: (Platform.OS === 'ios') ? 0 : 20}} >
       <MyStatusBar translucent backgroundColor="#464D4F" barStyle="default" />
        
        <Modal isVisible={this.state.showCreateBarCrawl} transparent={true}>
          <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
              
              <View style={{
                    height: 450,
                    width: 250,
                    backgroundColor: "white",
                    padding: 20,
                    alignItems: "center",
                    borderRadius: 5

                  }}>
                  <TouchableOpacity onPress={() => {this.setState({showCreateBarCrawl: false})}} style={{ alignSelf: "flex-start", paddingBottom: 5 }}>
                    <Icon name="times" size={25} color="#E87722" />
                  </TouchableOpacity>
                  <Title>Create Bar Crawl </Title>
                  <TextInput
                      style={{width: 220, height: 40, borderColor: '#E87722', borderWidth: 1, paddingBottom: 5}}
                      textAlign={'left'}
                      placeholder="Name your event!"
                      value={this.state.createBarCrawlData.eventName}
                      autoCorrect={false}
                      underlineColorAndroid={"#E87722" }
                      onChangeText={(value)=>this.setState({createBarCrawlData: {eventName: value, eventId: this.state.createBarCrawlData.eventId, eventMustBeSearched: this.state.createBarCrawlData.eventMustBeSearched, eventDate: this.state.createBarCrawlData.eventDate}})}
                    />
                    <Dropdown
                      label='Select your Bar Hunt!'
                      data={this.state.barHuntTemplate.map((item) => { return { value: item.id, label: item.city + " - " + item.title, }; })}
                      containerStyle={{ width: 210, height: 50, paddingBottom: 5 }}
                      onChangeText={(value)=>this.setState({createBarCrawlData: {eventName: this.state.createBarCrawlData.eventName, eventId: value, eventMustBeSearched: this.state.createBarCrawlData.eventMustBeSearched, eventDate: this.state.createBarCrawlData.eventDate}})}
                    />
                    <Dropdown
                      label='Select your event date!'
                      data={arrayOfDates.map((date) => { return { value: date.format('L'), label: date.format('L'), }; })}
                      containerStyle={{ width: 210, height: 50, paddingBottom: 5 }}
                      onChangeText={(value)=>this.setState({createBarCrawlData: {eventName: this.state.createBarCrawlData.eventName, eventId: this.state.createBarCrawlData.eventId, eventMustBeSearched: this.state.createBarCrawlData.eventMustBeSearched, eventDate: value}})}
                      
                    />
                    <Dropdown
                      label='Show Publically'
                      data={[{
                        value: true,
                        label: 'Yes - Have it show under private events',
                      }, {
                        value: false,
                        label: 'No - Require friends to type name',

                      }]}
                      containerStyle={{ width: 210, height: 80, paddingBottom: 40, marginBottom: 40 }}
                      onChangeText={(value)=>this.setState({createBarCrawlData: {eventName: this.state.createBarCrawlData.eventName, eventId: this.state.createBarCrawlData.eventId, eventMustBeSearched: value, eventDate: this.state.createBarCrawlData.eventDate}})}
                    />
                  <ThreeButtonGroup style={{paddingTop: 5}}>
                    <SmallButton bgColor={"#E87722"} text={"Create"} style={{height: 60, paddingTop: 5}} buttonHeight={40} textStyle={{color: "#000", fontSize: 15}}
                      onPress={async() => {
                        if (this.state.createBarCrawlData.eventName == null) {
                          Alert.alert('Please enter a fun name for your event!')
                        } else  if (this.state.createBarCrawlData.eventId == null) {
                          Alert.alert('Please select the bar hunt that you want to do!')
                        } else  if (this.state.createBarCrawlData.eventMustBeSearched == null) {
                          Alert.alert('Please specify if you want your event to be visible or must be searched for!')
                        } else  if (this.state.createBarCrawlData.eventDate == null) {
                          Alert.alert('Please enter a date for your event!')
                        } else {
                          let allTemplateKeys = Object.keys(this.state.barHuntTemplate);
                          let allTemplates = Object.values(this.state.barHuntTemplate);
                          console.log(allTemplateKeys);
                          console.log(this.state.createBarCrawlData.eventId);
                          console.log(allTemplateKeys.indexOf(this.state.createBarCrawlData.eventId));
                          let selectedTemplate = allTemplates[allTemplateKeys.indexOf(''+this.state.createBarCrawlData.eventId)];
                          console.log('The selected hunt template is :');
                          console.log(selectedTemplate);
                          selectedTemplate.eventName = this.state.createBarCrawlData.eventName;
                          selectedTemplate.eventDate = this.state.createBarCrawlData.eventDate;
                          selectedTemplate.eventMustBeSearched= this.state.createBarCrawlData.eventMustBeSearched;
                          selectedTemplate.publicEvent = false; //all 
                          selectedTemplate.creatingUserId = this.state.currentUser.userId; //all 
                          selectedTemplate.registeredPlayers = {[this.state.currentUser.userId]: true};
                          selectedTemplate.creatingUserName = this.state.currentUser.firstName;
                          selectedTemplate.baseId = selectedTemplate.id; 
                          selectedTemplate.id = uuid(); 
                          selectedTemplate.currentStage = 0; 
                          selectedTemplate.maxPlayers = 100;
                          selectedTemplate.startTime = 'Contact Organizer';
                          console.log('The selected hunt template is :');
                          console.log(selectedTemplate);

                          await setDataAtPath(
                            `barhunt/barhunts/${selectedTemplate.id}/`,
                            selectedTemplate
                          )
                          this.setState({showCreateBarCrawl: false});
                        }
                      }}
                     /> 
                  </ThreeButtonGroup>
              </View>
            </View>
          </Modal>

          <Modal isVisible={this.state.showFindFriendBarCrawl} transparent={true}>
            <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}>  
              <View style={{
                    height: 450,
                    width: 250,
                    backgroundColor: "white",
                    padding: 20,
                    alignItems: "center",
                    borderRadius: 5

                  }}>
                  <TouchableOpacity onPress={() => {this.setState({showFindFriendBarCrawl: false})}} style={{ alignSelf: "flex-start", paddingBottom: 5 }}>
                    <Icon name="times" size={25} color="#E87722" />
                  </TouchableOpacity>
                  <Title>Find Friends Bar Crawl </Title>
                  <TextInput
                      style={{width: 220, height: 40, borderColor: '#E87722', borderWidth: 1, paddingBottom: 5}}
                      textAlign={'left'}
                      placeholder="Enter!"
                      value={this.state.findFriendBarCrawlData}
                      autoCorrect={false}
                      underlineColorAndroid={"#E87722" }
                      onChangeText={(value)=>this.setState({ findFriendBarCrawlData: value })}
                    />
                  <ThreeButtonGroup style={{paddingTop: 5}}>
                    <SmallButton bgColor={"#E87722"} text={"Create"} style={{height: 60, paddingTop: 5}} buttonHeight={40} textStyle={{color: "#000", fontSize: 15}}
                      onPress={async() => {

                      }}
                     /> 
                  </ThreeButtonGroup>
              </View>
            </View>
          </Modal>

        {/* tutorial modal for user that explains how bar hunt work, shown when the question button is clicked */}
        <BarHuntInfoModal
          data={[
            {
              title: "Let’s Roam Bar Hunts",
              text: "Lets Roam is all about bringing people together. On a let’s Roam Bar hunt you will complete challenges and activities that force you to interact with your fellow Bar Crawlers and others. You earn points by being the first to compete challenges, winning tournament style games, and taking crazy photos/videos.",
              bg: require("../../images/barHuntInfoModal/bg1.jpg")
            },
            {
              title: "Private Events",
              text: "Private events are a fun style of bar crawl that you can do at any time. You will get to know your fellow team-mates in new and exciting ways. While you are at it, you will meet new people not playing the bar hunt. You can do these events at anytime. Just assemble your team!",
              bg: require("../../images/barHuntInfoModal/bg2.jpg")
            },
            {
              title: "Public Bar Hunts",
              text: "On a public bar crawl you will meet new people and have a blast. You will meet both people on your bar hunt and at the bars you visit. Make sure you invite your friends for a night you will remember.",
              bg: require("../../images/barHuntInfoModal/bg3.jpg")
            }
          ]}
          show={this.state.showBarHuntInfoModal}
          handleClose={() => {
            this.setState({ showBarHuntInfoModal: false })
          }}
        />

        {/* bar hunt detail modal: shown when a hunt is clicked */}
        <BarHuntDetailModal
          key={Object.values(this.state.barHuntData)}
          show={this.state.showBarHuntDetailModal}
          huntObj={this.state.barHuntDetailModalData}
          handleClose={() => {
            this.setState({ showBarHuntDetailModal: false });
          }}
          modalButtonAction={this.handleDetailModalAction}
          modalButtonActionText={this.state.huntDetailModalActionText}
        />

       <LoginModal
          show={this.state.showLoginModal}
          close={() => {
            this.setState({ showLoginModal: false });
          }}
        />

        {/* the logo on the top of the page */}
        <Image
          style={{ width: 200*.6, marginTop: 10, height: 112*.6, resizeMode: "cover" }}
          source={require("../../images/bar-hunt-icon.png")}
        />


        {/* navigation on the top of the screen */}
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => { this.setState({ navSelected: "PRIVATE" })}}>
            {this.state.navSelected == "PRIVATE" ?
              <Image style={{ width: width/3, height: width/3, marginTop: -width/6 }} source={require("../../images/private_selected.png")}/> :
              <Image style={{ width: width/3, height: width/3, marginTop: -width/6 }} source={require("../../images/private.png")}/>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.setState({ navSelected: "PUBLIC" })}}>
            {this.state.navSelected == "PUBLIC" ?
              <Image style={{ width: width/3, height: width/3, marginTop: -width/6 }} source={require("../../images/public_selected.png")}/> :
              <Image style={{ width: width/3, height: width/3, marginTop: -width/6 }} source={require("../../images/public.png")}/>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.setState({ navSelected: "MY EVENTS" })}}>
            {this.state.navSelected == "MY EVENTS" ?
              <Image style={{ width: width/3, height: width/3, marginTop: -width/6 }} source={require("../../images/my_events_selected.png")}/> :
              <Image style={{ width: width/3, height: width/3, marginTop: -width/6 }} source={require("../../images/my_events.png")}/>
            }
          </TouchableOpacity>
        </View>

        {/* back button that go back to landing page, placed lower so at front of stack */}
        <BackButton
          onPress={() => {
            goBack();
          }}
        />

         {/* question mark button on the top-right corner, placed lower so at front of stack */}
         <QuestionMarkButton styles={{top: 8, right: (width-170)/2}} onPress={this.handleQuestionMarkPress} />

         <TouchableOpacity onPress={() => { this.props.navigation.navigate('DrawerToggle') }} style={{ position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(0,0,0,0)' }}>
            <Icon name="bars" size={30} color={Color('white').alpha(0.9)} />
          </TouchableOpacity>


        {/* bar list shown when Public nav is selected */}
        {this.state.navSelected == "PUBLIC" &&
          // <BarHuntList
          //   barHuntData={Object.values(this.state.barHuntData)}
          //   cellPressHandler={(item) => {
          //     this.openDetailModal(item);
          //   }}
          // />
          <FlatList
            style={{ marginTop: 0 }}
            data={Object.values(this.state.barHuntData)}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={{flex: 1}} onPress={() => {
                  this.openDetailModal(item);
                }}>
                  <BarHuntCell
                  item={item}
                  index={index}
                />
                </TouchableOpacity>
              )
            }}
          />
        }

        {/* hunt list shown when My events is clicked */}
        {this.state.navSelected == "MY EVENTS" &&
          this.state.barHuntDataFiltered.length !== 0 &&
          <FlatList
            style={{ marginTop: 0 }}
            data={this.state.barHuntDataFiltered}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item, index }) => {
              console.log('the current item being rendered for my events is: ');
              console.log(item);
              return (
                <TouchableOpacity style={{flex: 1}} onPress={() => {
                  this.openDetailModal(item);
                }}>
                  <BarHuntCell
                  item={item}
                  index={index}
                />
                </TouchableOpacity>
              )
            }}
          />
        }

        {/* shown when My events is clicked but there is no events */}
        {
          this.state.navSelected == "MY EVENTS" &&
          this.state.barHuntDataFiltered.length == 0 &&
          <PrivateSection
            values={[
              {
                text: "Please register for an event",
                action: () => {
                  console.log('create pressed');
                }
              }
            ]}
          />
        }

        {/* shown when Private nav is selected but there is no events */}
        {this.state.navSelected == "PRIVATE" &&
          <PrivateSection
            values={[
              {
                text: "Create a Bar Crawl for your friend",
                action: () => {
                  this.setState({ showCreateBarCrawl: true });
                }
              },
              {
                text: "Find a your friend's bar crawl",
                action: () => {
                  this.setState({ showFindFriendBarCrawl: true });
                }
              }
            ]}
          />
        }

      </Container>
    </SafeAreaView>
    );
  }
};

const CenterText = styled.Text`
  text-align: center;
`;

const Container = styled.View`
  background-color: #464D4F;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;


const BackButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 10;
  left: 0;
`;
const Title = styled.Text`
  font-size: 25px;
  text-align: center;
  color: #E36B21;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ThreeButtonGroup = styled.View`
  flex-direction: row;
  margin-top: 5px;
  height: 70px;
  justify-content: space-between;

`;