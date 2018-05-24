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
  ScrollView,
  AsyncStorage,
  Image,
  PermissionsAndroid
} from 'react-native';
import styled from 'styled-components';
import { DrawerNavigator } from 'react-navigation';

import google from './utils/google';
let { isGoogleSessionExists, getGoogleSignin } = google;
import { facebookLogin } from './utils/facebook';
import fireUtil from './utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;
import LoginModal from './LandingPage/NewLoginModal';
import { getDatabase } from "./utils/db";
import uuid from 'uuid/v4';
import { facebookLogout } from "./utils/facebook";

import Profile from './LandingPage/Profile';
import LandingPage from './LandingPage/NewLandingPage';
import ActivitiesSelection from './LandingPage/ActivitiesSelection';
import Tickets from './LandingPage/Tickets';

import BarHuntHome from './barhunt/Registration/HuntHome';
import GameView from './barhunt/Game/GameView';
//import ScavengerHunt from './barhunt/Registration/ScavengerHunt';
import ScavengerHunt from './scavengerhunt/ScavengerHuntSubApp.js';

// testing 
import ProfilePhoto from './LandingPage/ProfilePhoto';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

//defining redux
import { connect } from 'react-redux';
import { saveUserLocation } from './redux/actions/user_location.actions';
import { saveUserInfo } from './redux/actions/user_info.actions';

import {getStateForAction, withNavigationPreventDuplicate} from './Drawer_actions'

class App extends Component {

  constructor() {
    super();
    this.state = {
      showLoginModal: false,
      showInfoModal: false,
      allTickets: null,
      playerTicket: null,
      playTestMode: false,
      showFindFriendTicket: false,
      voucherInputText: ""
    }
  }



  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  async checkLogin(userId) {
    let userInfo = await getUserInfo(userId);
    console.log('the user info object is being saved')
    console.log(userInfo)
    this.props.saveUserInfo(userInfo);
    console.log(userInfo)
  }
  async componentDidMount() {
    // check if there is facebook session
    console.log('the component did mount')
    AsyncStorage.getItem("userId")
      .then((userId) => {
        if(userId){
          this.props.saveUserInfo(userId);
        }
      });

    let ticketsRef = getDatabase().ref(`tickets`);

    if (Platform.OS == "ios") {
      this.getLocation()
    } else {
      this.androidGetPermission()
    }


    ticketsRef.on("value", (snapshot) => {
      let allTickets = null
      let playerTicket = null;
      if (snapshot.val() != null) {
        allTickets = Object.values(snapshot.val());
        allTicketObjects = snapshot.val();

        for (let j = 0; j < allTickets.length; j++) {
          if (allTickets[j].users != null && allTickets[j].playersMax - allTickets[j].playersUsed > 0) {
            let usersForTicket = Object.keys(allTickets[j].users);
            if (usersForTicket.indexOf(userId) > -1) {
              console.log('The players ticket number is ' + allTickets[j].ticketNumber);
              playerTicket = allTickets[j]
            }
          }
        }
      }
      this.setState({ playerTicket, allTickets: allTicketObjects });
      console.log('The players ticket object is ');
      console.log(this.state.playerTicket);
      console.log('All the tickets are');
      console.log(this.state.allTickets);
    });

    //checking to see if the app is in playtest mode
    let PlaytestRef = getDatabase().ref(`playTestState`);
    PlaytestRef.on("value", (snapshot) => {
      let newValue = snapshot.val();
      console.log('The value of the snapshot is ' + newValue);
      this.setState({ playTestState: newValue });
      console.log('The game is currently in playtest mode??? ' + this.state.playTestState);
      if (this.state.showBarHuntDetailModal == true) {
        this.openDetailModal(this.state.barHuntDetailModalData);
      }
    });
  }

  getLocation() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log('We know your current position is: ' + position.coords.latitude + ',' + position.coords.longitude);
        this.props.saveUserLocation(position);
      }
    );
  }

  async androidGetPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Scavenger Hunts Need Location Permision',
          'message': 'Please enable location so we you can do a scavenger hunt'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getLocation();
      } else {
        console.log("Camera permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  goToProfile = async () => {
    let { navigate, replace } = this.props.navigation;
    navigate("Profile", {
      onBack: this.checkLogin
    })
  }

  handleProfileButtonPress = () => {

    if (loggedIn) {
      this.setState({ showLoginModal: true });
    } else {
      // navigate("Login")
      this.setState({ showLoginModal: true });
    }

  }



  render() {
    console.log('The saved redux user object is: ')
    console.log(this.props.user)
    let props = {
      data: "data",
      auth_code: this.state.auth_code,
      userInfo: this.props.user.info,
      handleSignInPress: () => {
        this.setState({ showLoginModal: true });
      },
      updateAuthCode: (auth_code) => {
        this.setState({ auth_code, huntQuestionDataRequested: false })
      },
      updateHuntData: (huntQuestionData) => {
        this.setState({ huntQuestionData })
      }
    };
    return (
      <View style={{ flex: 1 }}>
        <LoginModal
          show={this.state.showLoginModal}
          close={() => {
            this.setState({ showLoginModal: false });
          }}
        />
        <Drawer
          screenProps={props}
          userInfo={this.state.userInfo}
        />
      </View>
    );
  }
}
;

class NavButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{ width: 200, height: 50 }}
        onPress={this.props.navigationAction}
      >
        <View style={{ flex: 1, backgroundColor: '#D9D9D6', marginTop: 2, marginLeft: 1, marginRight: 1 }}>
          <Text style={{ textAlign: 'center', fontSize: 30, fontFamily: 'Alternate Gothic No1 D' }}>
            {this.props.screenTitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
};

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 150, width: 200, backgroundColor: '#6AAEAA', alignItems: 'center' }}>
          {this.props.screenProps.userInfo != null &&
            <View>
              <Image
                style={{ width: 65, height: 65, borderRadius: 32.5, borderWidth: 2, borderColor: "black", marginTop: (150 - 65) / 2 }}
                source={{ uri: this.props.screenProps.userInfo.photoUrl || require('./images/profileIcon.png') }}
              />
               <Text style={{ marginTop: 5, textAlign: 'center', color: 'white' }}>{this.props.screenProps.userInfo.firstName.toUpperCase()}</Text>
            </View>
          }
          {this.props.screenProps.userInfo == null &&
            <Image
              style={{ width: 65, height: 65, borderRadius: 32.5, borderWidth: 2, borderColor: "black", marginTop: (150 - 65) / 2 }}
              source={require('./images/profileIcon.png')}
            />
          }
        </View>
        {this.props.screenProps.userInfo == null &&
        <NavButton
          screenTitle={"Please sign in"}
          navigationAction={this.props.screenProps.handleSignInPress}
        />
        }
        <NavButton
          screenTitle={"Let's Roam Home"}
          navigationAction={() => this.props.navigation.navigate('LandingPage')}
        />
        <NavButton
          screenTitle={"View All Activities"}
          navigationAction={() => this.props.navigation.navigate('ActivitiesSelection')}
        />
        <NavButton
          screenTitle={'Scavenger Hunts'}
          navigationAction={() => this.props.navigation.navigate('ScavengerHunt')}
        />
        <NavButton
          screenTitle={"Find a Bar Hunt"}
          navigationAction={() => this.props.navigation.navigate('BarHuntHome')}
        />
        <NavButton
          screenTitle={"Get Coins"}
          navigationAction={() => this.props.navigation.navigate('Tickets')}
        />
        {this.props.screenProps.userInfo != null &&
        <NavButton
          screenTitle={"Sign out"}
          navigationAction={this.props.screenProps.handleSignInPress}
        />
        }
      </View>
    );
  }
}
;


const Drawer = DrawerNavigator({
  LandingPage: {
    screen: LandingPage,
    navigationOptions: {
      drawerLabel: "Let's Roam Home"
    }
    //the page that opens when the app opens
    //the page is orage with the fox on the top
    //it has a login function, a link to the bar hunt pages, to scavenger hunts, and getting tickets
  },
  ScavengerHunt: { // move the page here temp for testing purpose
    screen: ScavengerHunt,
    navigationOptions: {
      header: null,
      drawerLabel: 'Scavenger Hunts'
    }
    //    //this is the page that shows when the user joins a bar hunt
    //    //it has the bar itenary, the player list, and the challenge list
  },
  // OldLandingPage: {
  //   screen: OldLandingPage
  //   //the page that opens when the app opens
  //   //the page is orage with the fox on the top
  //   //it has a login function, a link to the bar hunt pages, to scavenger hunts, and getting tickets
  // },
  ActivitiesSelection: {
    screen: ActivitiesSelection,
    navigationOptions: {
      drawerLabel: "View All Activities"
    }
    //the page that opens when the app opens
    //the page is orage with the fox on the top
    //it has a login function, a link to the bar hunt pages, to scavenger hunts, and getting tickets
  },
 
  BarHuntHome: {
    screen: BarHuntHome,
    navigationOptions: {
      drawerLabel: "Find a Bar Hunt"
    }
    //this is the page that is linked to from the landing page
    //it has the public events, private events, and my events page
  },


  Tickets: {
    screen: Tickets,
    navigationOptions: {
      drawerLabel: "Get Coins"
    }
    //the page that opens when the app opens
    //the page is orage with the fox on the top
    //it has a login function, a link to the bar hunt pages, to scavenger hunts, and getting tickets
  },
  GameView: {
    screen: GameView,
    navigationOptions: {
      drawerLabel: () => null
    }
    //this is the page that shows when the user joins a bar hunt
    //it has the bar itenary, the player list, and the challenge list
  },
  // ProfilePhoto: {
  //   screen: ProfilePhoto
  //   //this is a temp testing page for uploading a photo
  // },

  Profile: {
    screen: Profile
    //this is the the profile page
    //it is accessed via the lets roam main page
    //it has meta details about the hunter 
  }
}, {
    contentComponent: props => <SideMenu {...props} />,
    drawerWidth: 200,
    navigationOptions: {
      tabBarPosition: 'bottom'
    },
    transitionConfig: () => {
      return { screenInterpolator: CardStackStyleInterpolator.forHorizontal }
    },
    initialRouteName: 'ScavengerHunt'
    //initialRouteName: 'LandingPage'

  });
  Drawer.router.getStateForAction = withNavigationPreventDuplicate(
    Drawer.router.getStateForAction
  );

//notes on redux
//passing properties from the store and making them available in the component
//what we are doing here is passing the store property to this component
//makes it available from this.props
//access data in component did mount this.props.hunts.items
const mapStateToProps = (state) => {
  const { location, user } = state;
  return { location, user };
}

//defining the actions that I want available for this component
//need to import the actions from the action folder in order to use
const actions = { saveUserLocation, saveUserInfo };

//assigning the property and the actions to the component
//how redux connects to the component
App = connect(mapStateToProps, actions)(App);

export default App;