// Show hunt list so that the user can register or join
//android permisions for geolocation
//https://facebook.github.io/react-native/docs/permissionsandroid.html

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
  StatusBar,
  Linking,
  PermissionsAndroid,
  ScrollView
} from 'react-native';
import styled from 'styled-components';
import MyText from 'react-native-letter-spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../../images/logo.png");
let logo3 = require("../../images/logo3.png");
let logo4 = require("../../images/logo4.png");
import google from '../../utils/google';
let { isGoogleSessionExists, getGoogleSignin } = google;
import fireUtil from '../../utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;
import { getDatabase } from "../../utils/db";
import uuid from 'uuid/v4';

let { width, height } = Dimensions.get("window");

import BarHuntInfoModal from '../../modules/InfoModal';

import BackButton from '../../modules/BackButton';
import QuestionMarkButton from '../../modules/QuestionMarkButton';
import SmallButton from '../../modules/HomeSmallButton';
import LetsRoamHeader from '../../modules/LetsRoamHeader'
import PageHeader from '../../modules/PageHeader'

import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationActions } from 'react-navigation';
import StarRatingBar from 'react-native-star-rating-view/StarRatingBar'


import { connect } from 'react-redux';
import { retrieveHuntList } from '../../redux/actions/hunts.actions';

import HTML from 'react-native-render-html';

import axios from 'axios';
import geolib from 'geolib';





const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default class List extends Component {

  static navigationOptions = {
    header: null
  };

  constructor() {
    super();

    this.state = {
      selectedTheme: null,
      previousHuntAuthCode: ''
    }
  }

  // handle question mark button click
  handleQuestionMarkPress = () => {
    this.setState({ showBarHuntInfoModal: true });
  }
  
  render() {
    let { goBack, navigate } = this.props.navigation;
    let { width, height } = Dimensions.get("window");
    let selectedHunt = this.props.navigation.state.params.selectedHunt
    console.log('The Registration Home Page is being Reloaded')
    console.log('The long description is')
    console.log(selectedHunt.long_description.replace(/<br>/ig, '').replace(/&nbsp;/ig,'').replace(/<p><\/p>/ig,'').replace(/<p[^>]*>[\s|&nbsp;]*<\/p>/,''))
    return (
    <Container style={{flex: 1, backgroundColor: 'white'}}>
       <LetsRoamHeader  
        handleDrawerPress={this.props.screenProps.handleDrawerPress}
      />
      <PageHeader  
              headerTitle={'3. THEME SELECTION'}
              backgroundColor={'#53A6C4'}
              backAction={() => this.props.navigation.goBack()}
      /> 
      <View style={{position: 'absolute', top: 70+35-20, height: 130, left: 0, right: 0}} >
        <Image source={{uri: selectedHunt.huntLargePhotoURL}}
        style={{flex: 1, height: 130}} />
      </View> 
      
      <View style={{position: 'absolute', backgroundColor: 'rgba(80,87,89,0.5)', top: 70+35-20, height: 130, left: 0, right: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}} >
        <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 18, textAlign: 'center'}}>
          {selectedHunt.city + ' Scavenger Hunt'}
        </Text>
        <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 40, textAlign: 'center'}}>
          {selectedHunt.name}
        </Text>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
          <View style = {{height: 5, width: 60}} />
          <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 18, marginRight: 10}}>
            {Math.max(selectedHunt.total_reviews,10) + ' Reviews'}
          </Text>
          <StarRatingBar
                      score={Math.max(selectedHunt.star_rating,4)}
                      continuous={true}
                      allowsHalfStars={true}
                      accurateHalfStars={true}
                      scoreTextStyle={{color: 'rgba(0,0,0,0)'}}
          />
        </View>
      </View> 
      <View style={{position: 'absolute', backgroundColor: 'rgba(217,217,214,1)', top: 70+35-20+130, height: 20, left: 0, right: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}} >
        <Text style={{color: '#505759', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center'}}>
            {'Starts At: '+ selectedHunt.starting_location.replace(/\d{5},\sU[^>]+/ig,'').replace(/\sUSA/,'').replace(/\sUnited\sStates/,'').replace(/[,;]$/,'').replace(/\s+$/,'')}
        </Text>
      </View> 
      <ScrollView style={{position: 'absolute', backgroundColor: 'white', top: 70+35-20+130+20, bottom: 0, left: 20, right: 20}} >
          <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 21, marginTop: 14, marginBottom: 10, textDecorationLine: 'underline'}}>
            {('Select your theme').toUpperCase()}
          </Text>
          <Theme 
          width={width}
          theme={'Standard'}
          selectedTheme={this.state.selectedTheme}
          description={'This is our standard hunt and is fun for most events. However consider checking out our Date Night, Birthday, or Bachelorette hunts for a little bit of extra fun!'}
          photo={require('../../images/standardTheme.png')}
          price={0}
          backgroundColor={'rgba(232, 119, 34, .5)'}
          onPress={(selectedTheme) => this.setState({selectedTheme})}
          navigation={this.props.navigation}
          />
          <Theme 
          width={width}
          theme={'Date Night'}
          selectedTheme={this.state.selectedTheme}
          description={'This is our standard hunt but even more datey! Enjoy romantic theme roles and challenges. Perfect for dates and double dates!'}
          photo={require('../../images/dateTheme.png')}
          price={400}
          backgroundColor={'rgba(106, 174, 170, .5)'}
          onPress={(selectedTheme) => this.setState({selectedTheme})}
          navigation={this.props.navigation}
          />
          <Theme 
          width={width}
          theme={'Birthday'}
          selectedTheme={this.state.selectedTheme}
          description={'This is our standard hunt but with a birthday twist! Explore the city with your birthday star being the center of attention!'}
          photo={require('../../images/birthdayTheme.png')}
          price={400}
          backgroundColor={'rgba(255, 198, 0, .5)'}
          onPress={(selectedTheme) => this.setState({selectedTheme})}
          navigation={this.props.navigation}
          />
          <Theme 
          width={width}
          theme={'Bachelorette'}
          selectedTheme={this.state.selectedTheme}
          description={'Make your bride to be the center of attention with this fun hunt. There are a ton of challenges that will bring the girls together for this last hurrah!'}
          photo={require('../../images/bacheloretteTheme.png')}
          price={400}
          backgroundColor={'rgba(80, 87, 89, .5)'}
          onPress={(selectedTheme) => this.setState({selectedTheme})}
          navigation={this.props.navigation}
          />
      </ScrollView>
    </Container>
    );
  }
};

class Theme extends Component {

  render(){
    let selectedHunt = Object.assign({},this.props.navigation.state.params.selectedHunt)
    selectedHunt.theme = this.props.selectedTheme
    selectedHunt.huntPrice = 1000
    selectedHunt.themePrice = this.props.price
    return (
        <View style={{ height: 100 + (this.props.theme == this.props.selectedTheme ? 100 : 0), width: this.props.width, backgroundColor: 'black', marginBottom: 10}} >
          <Image
            source={this.props.photo}
            style={{height: 100, width: this.props.width-40, position: 'absolute', top: 0, left: 0}}
          />
          <TouchableOpacity
            style={{backgroundColor: this.props.backgroundColor, height: 100, width: this.props.width-40, position: 'absolute', top: 0, left: 0, alignContent: 'center', justifyContent: 'center'}}
            onPress={() => this.props.onPress(this.props.theme == this.props.selectedTheme ? '' : this.props.theme )}
          >
            <Text style={{color: 'white', fontSize: 40, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}>
                {this.props.theme.toUpperCase()}
            </Text>
          </TouchableOpacity>
          {this.props.theme == this.props.selectedTheme &&
            <View
            style={{backgroundColor: 'white', borderColor: '#505759', borderWidth: 1, height: 100, width: this.props.width-40, position: 'absolute', bottom: 0, left: 0, alignContent: 'flex-start', justifyContent: 'flex-start', paddingLeft: 10, paddingRight: 10}}
            >
              <Text style={{color: '#505759', fontSize: 12, fontFamily: 'CircularStd', textAlign: 'center'}}>
                  {this.props.description}
              </Text>
              <TouchableOpacity 
                style = {{backgroundColor: '#6AAEAA', position: 'absolute', height: 30, left: 40, right: 40, bottom: 10}} 
                 //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
                onPress={() => {  this.props.navigation.navigate('RegistrationConfirm', { selectedHunt: selectedHunt }) }}
              >
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={{color: 'white', fontSize: 15, marginLeft: 15, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}> 
                    {('SELECT/ ' + (selectedHunt.huntPrice + selectedHunt.themePrice) + ' Coins Per Person').toUpperCase()}
                  </Text>
                </View>
             </TouchableOpacity>
            </View>
          }
        </View>
    )
  }
}


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

        {/* {this.props.screenProps.user.info != null &&
        <TouchableOpacity 
            style = {{backgroundColor: '#E87722', height: 50, width: width-60, marginTop: 40, marginLeft: 10}} 
            //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
            onPress={() => this.props.screenProps.createScavengerHunt(this.props.navigation.state.params.selectedHunt)}
          >
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: 'white', fontSize: 25, marginLeft: 15, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}> Create Scavenger Hunt</Text>
            </View>
        </TouchableOpacity>
        }
        {this.props.screenProps.user.info  == null &&
        <TouchableOpacity 
            style = {{backgroundColor: '#E87722', height: 50, width: width-60, marginTop: 40, marginLeft: 10}} 
            //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
            onPress={this.props.screenProps.handleSignInPress}
          >
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: 'white', fontSize: 25, marginLeft: 15, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}> Please Log In</Text>
            </View>
        </TouchableOpacity>
        } */}