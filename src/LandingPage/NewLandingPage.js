import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  AsyncStorage
} from 'react-native';

import { connect } from 'react-redux';
import { retrieveHuntList } from '../redux/actions/hunts.actions';
import { logOutUser } from '../redux/actions/user_info.actions';

import styled from 'styled-components';
import MyText from 'react-native-letter-spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../images/logo.png");
let logo3 = require("../images/logo3.png");
let logo4 = require("../images/logo4.png");

import google from '../utils/google';
let { isGoogleSessionExists, getGoogleSignin } = google;
import { facebookLogin } from '../utils/facebook';
import fireUtil from '../utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;
import { getDatabase } from "../utils/db";
import uuid from 'uuid/v4';
import { facebookLogout } from "../utils/facebook";



let { width, height } = Dimensions.get("window");

import Swiper from 'react-native-swiper';
import Carousel from 'react-native-snap-carousel';
import Color from 'color'


class Header extends Component {
  render() {
    return (
      <View style={{ width: width, height: 50, backgroundColor: this.props.backgroundColor, justifyContent: 'center' }} >
        <Text
          style={{ textAlign: 'center', color: 'white', fontFamily: 'Alternate Gothic No1 D', fontSize: 42 }}
        >
          {this.props.currentlySelected ? this.props.headerText.toUpperCase() : ('SWIPE UP FOR ' + this.props.headerText.toUpperCase())}
        </Text>
        {this.props.currentlySelected &&
          <TouchableOpacity onPress={this.props.drawerAction} style={{ position: 'absolute', top: 9, right: 12, backgroundColor: 'rgba(0,0,0,0)' }}>
            <Icon name="bars" size={30} color={Color('white').alpha(0.9)} />
          </TouchableOpacity>
        }
      </View>
    );
  }
}
class Body extends Component {
  render() {
    return (
      <View style={{ flex: 1, elevation: 0 }}>
        <Image
          style={{ resizeMode: "cover", height: height, width: width }}
          source={this.props.source}
        />
        <View style={{ position: 'absolute', left: 20, right: 20, top: 100, bottom: 100, backgroundColor: 'black' }}>
          <View style={{ backgroundColor: 'black', position: 'absolute', height: height - 350, top: 0, left: 0, right: 0 }}>
            {this.props.children}
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: this.props.bodyButtonColor, position: 'absolute', height: 50, bottom: 0, left: 0, right: 0,
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 10
            }}
            onPress={this.props.bodyButtonAction}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontSize: 25, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center' }}> {this.props.bodyButtonText.toUpperCase()} </Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

class TextWithImageOverlay extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{ resizeMode: 'cover', position: 'absolute', top: 0, left: 0, width: width - 40, height: height - 350 }}
          source={this.props.source}
        />
        <View style={{ position: 'absolute', top: 0, left: 0, width: width - 40, height: height - 350, backgroundColor: this.props.overLayTint }} >
          <View style={{ flex: 8 }} />
          <Text style={{ color: 'white', fontSize: 30, fontWeight: '400', fontFamily: 'Alternate Gothic No3 D', textAlign: 'center' }}>
            {this.props.text}
          </Text>
          <View style={{ flex: 3 }} />
        </View>
      </View>
    );
  }
}


//this.props.navigation.navigate('DrawerToggle');
class MyCarousel extends Component {

  static navigationOptions = {
    header: null
  };
  constructor() {
    super();

    this.state = {
      showLoginModal: false,
      showInfoModal: false,
      allTickets: null,
      playerTicket: null,
      playTestMode: false,
      showFindFriendTicket: false,
      voucherInputText: "",
      currentSlideIndex: 0,
      entries: [{ title: '1', color: 'red' }, { title: '2', color: 'blue' }, { title: '3', color: 'orange' }, { title: '4', color: 'orange' }, { title: '5', color: 'orange' }]
    }
  }

  componentDidMount() {

    this.props.retrieveHuntList();

    // for testing
    //this.props.navigation.navigate('ActivitiesSelection')
  }

  //this.props.navigation.navigate('DrawerToggle');
  _renderItem({ item, index }) {
    console.log('the landing page did mount')
    console.log('The user is logged in?:' + this.props.user.info)
    if (item.title == 1) {
      return (
        <Container style={{ flex: 1, backgroundColor: '#D9D9D6' }}>
          <Image
            style={{ resizeMode: "cover", height: height, width: width }}
            source={require("../images/girls_background.png")}
          />
          <View style={{ backgroundColor: 'rgba(232, 119, 34, .54)', position: 'absolute', height: height, width: width }}>
            <Image
              style={{ resizeMode: "cover", height: 95 * 0.9, width: 225 * 0.9, marginTop: 20, marginLeft: width / 2 - (112.5 * 0.9) }}
              source={require("../images/logo3.png")}
            />
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#6AAEAA', position: 'absolute', height: 50, bottom: 150, left: 52, right: 52 }}
            //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
            onPress={() => { this.props.navigation.navigate('ActivitiesSelection') }}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontSize: 25, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center' }}> ACTIVITIES </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#FFC600', position: 'absolute', height: 50, bottom: 76, left: 52, right: 52 }}
            onPress={this.props.user.loggedIn ? () => console.log('hi') : this.props.screenProps.handleSignInPress}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontSize: 25, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center' }}> {this.props.user.loggedIn ? 'GET COINS' : 'SIGN IN'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('DrawerToggle') }} style={{ position: 'absolute', top: 40, right: 20, backgroundColor: 'rgba(0,0,0,0)' }}>
            <Icon name="bars" size={30} color={Color('white').alpha(0.9)} />
          </TouchableOpacity>
        </Container>
      );
    }
    if (item.title == 2) {

      return (
        <Container style={{ flex: 1 }}>
          <Header
            headerText={'Your stats'}
            backgroundColor={'#D9D9D6'}
            currentlySelected={parseInt(item.title) == parseInt(this.state.currentSlideIndex) + 1}
            drawerAction={() => this.props.navigation.navigate('DrawerToggle')}
          />
          <Body
            source={require("../images/characterBackground.jpg")}
            bodyButtonText={this.props.user.loggedIn ? 'START AN ADVENTURE' : 'PLEASE LOG IN'}
            bodyButtonColor={'#6AAEAA'}
            bodyButtonAction={this.props.user.loggedIn ? () => this.props.navigation.navigate('ActivitiesSelection') : this.props.screenProps.handleSignInPress}
          >
            {this.props.user.loggedIn &&
            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(81,87,89)', flex: 1 }}>
              
                <Image
                  style={{ width: 65, height: 65, borderRadius: 32.5, borderWidth: 2, borderColor: "black" }}
                  source={{ uri: this.props.user.info.photoUrl || "" }}
                />
                <View>
                  <Text style={{ textAlign: 'center', color: 'white', marginTop: 10 }}>{this.props.user.info.firstName}</Text>
                  <Text style={{ textAlign: 'center', color: 'white' }}>{'Level 1'}</Text>
                </View>
              
              
            </View>
            }
            {!this.props.user.loggedIn &&
            <TextWithImageOverlay
              source={require("../images/registrationStartImage.png")}
              text={'Your adveture awaits you!'}
              overLayTint={'rgba(232, 119, 34,0.5)'}
            />
            }

          </Body>
        </Container>
      );
    }
    if (item.title == 3) {
      return (
        <Container style={{ flex: 1 }}>
          <Header
            headerText={'Activities'}
            backgroundColor={'#FFC600'}
            currentlySelected={parseInt(item.title) == parseInt(this.state.currentSlideIndex) + 1}
            drawerAction={() => this.props.navigation.navigate('DrawerToggle')}
          />
          <Body
            source={require("../images/activitiesBackground.jpg")}
            bodyButtonText={'See All Activities'}
            bodyButtonColor={'#6AAEAA'}
            bodyButtonAction={() => this.props.navigation.navigate('ActivitiesSelection')}
          >
            <Swiper
              paginationStyle={{ position: 'absolute', bottom: 50 }}
              activeDotColor={'white'}
              key={this.state.currentSlideIndex}
            >
              <TextWithImageOverlay
                source={require("../images/activitiesScavengerHuntBackground.png")}
                text={'Scavenger hunts are a fun way to explore the city with friends!'}
                overLayTint={'rgba(232, 119, 34,0.5)'}
              />
              <TextWithImageOverlay
                source={require("../images/activitiesBarHuntBackground.png")}
                text={'Bar Hunts are a fun way to see the city at night in a competitive way!'}
                overLayTint={'rgba(206, 174, 170,0.5)'}
              />
              <TextWithImageOverlay
                source={require("../images/activitiesTeamBuildingBackground.png")}
                text={'Get to know your coworkers and friends better with our custom team-building events'}
                overLayTint={'rgba(255, 198, 0,0.5)'}
              />
            </Swiper>
          </Body>
        </Container>
      );
    }
    if (item.title == 4) {
      return (
        <Container style={{ flex: 1 }}>
          <Header
            headerText={'Get coins'}
            backgroundColor={'#53A6C4'}
            currentlySelected={parseInt(item.title) == parseInt(this.state.currentSlideIndex) + 1}
            drawerAction={() => this.props.navigation.navigate('DrawerToggle')}
          />
          <Body
            source={require("../images/coinsBackground.jpg")}
            bodyButtonText={'Get coins to play'}
            bodyButtonColor={'#6AAEAA'}
            bodyButtonAction={() => Alert.alert('This get coins feature is still under development')}
          >
            <View style={{ backgroundColor: 'rgba(80,87,89,1)', flex: 1 }} >
              <View style={{ position: 'absolute', top: 0, left: 0, width: width - 40, backgroundColor: 'rgba(80,87,89,1)', alignItems: 'center' }} >
                <Image
                  style={{ width: 120, height: 120, marginTop: 10 }}
                  source={require("../images/coinImage.png")}
                />
                <Text style={{ color: 'white', fontSize: 30, fontWeight: '400', fontFamily: 'Alternate Gothic No3 D', textAlign: 'center', marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                  {'Our games require coins to play per player. Buy tokens to play!'}
                </Text>
              </View>
            </View>
          </Body>
        </Container>
      );
    }


    if (item.title == 5) {
      return (
        <Container style={{ flex: 1 }}>
          <Header
            headerText={'Stay connected'}
            backgroundColor={'#505759'}
            currentlySelected={parseInt(item.title) == parseInt(this.state.currentSlideIndex) + 1}
            drawerAction={() => this.props.navigation.navigate('DrawerToggle')}
          />
          <Body
            source={require("../images/stayConnectedBackground.jpg")}
            bodyButtonText={'Read Our Blog'}
            bodyButtonColor={'#FFC600'}
            bodyButtonAction={() => Alert.alert('This blog feature is still under development')}
          >
            <TextWithImageOverlay
              source={require("../images/blogBackground.jpg")}
              text={'Keep up to date with our best hunts around the country by checking out our blog!'}
              overLayTint={'rgba(0,0,0,0)'}
            />
          </Body>
        </Container>
      );
    }
  }


  render() {
    console.log('hi')
    let backgroundColor = 'black';
    if (Platform.OS == "android") {
      console.log('The operating system is android and the current slide index is ' + this.state.currentSlideIndex)
      if (this.state.currentSlideIndex == 1) {
        backgroundColor = 'black'
      } else {
        backgroundColor: 'black'
      }
    }
    return (
      <SafeAreaView>
        <Carousel
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          ref={(c) => { this._carousel = c; }}
          data={this.state.entries}
          renderItem={this._renderItem.bind(this)}
          sliderHeight={height}
          itemHeight={height - (Platform.OS == "android" ? 70 : 100)}
          vertical
          inactiveSlideOpacity={1}
          inactiveSlideScale={Platform.OS == "android" ? 1 : 0.9}
          activeSlideAlignment={'start'}
          onSnapToItem={(slideIndex) => {
            console.log('The current slide index is ' + slideIndex)
            this.setState({ currentSlideIndex: slideIndex })
          }}
        />
      </SafeAreaView>
    );
  }

  async logOut() {
    console.log(`here is for var zero value is `);
    let google = await getGoogleSignin();
    console.log(`here is for var one value is `);
    let googleSessionExists = await isGoogleSessionExists();
    if (googleSessionExists) {
      await google.signOut();
    }

    // facebook can log out directly
    facebookLogout();

    // delete the userId in the AsyncStorage
    await AsyncStorage.removeItem("userId");
    this.logOutAction;
    this.props.logOutUser();
  }

  logOutAction() {
    console.log('the action going')
    this.props.logOutUser();
  }
}

//notes on redux
//passing properties from the store and making them available in the component
//what we are doing here is passing the store property to this component
//makes it available from this.props
//access data in component did mount this.props.hunts.items
const mapStateToProps = (state) => {
  const { hunts, user } = state;
  return { hunts, user };
}

//defining the actions that I want available for this component
//need to import the actions from the action folder in order to use
const actions = { retrieveHuntList, logOutUser };

//assigning the property and the actions to the component
//how redux connects to the component
MyCarousel = connect(mapStateToProps, actions)(MyCarousel);

//standard export statement
export default MyCarousel;

const CenterText = styled.Text`
  text-align: center;
`;

const Container = styled.View`
  background-color: #D9D9D6;
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
