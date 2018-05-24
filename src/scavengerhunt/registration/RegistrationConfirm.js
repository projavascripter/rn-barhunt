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
      previousHuntAuthCode: '',
      teamName: null,
      prePaidPlayers: null,
      eventDate: null

    }
  }

  // handle question mark button click
  handleQuestionMarkPress = () => {
    this.setState({ showBarHuntInfoModal: true });
  }
  
  createHuntPressed = (selectedHunt) => {
    if (selectedHunt.teamName == null || selectedHunt.teamName == '') {
      Alert.alert('Please enter a team name. Make it fun!')
    } else if (selectedHunt.prePaidPlayers == null || selectedHunt.prePaidPlayers == '') {
      Alert.alert('Please enter the number of players you are prepaying for.')
    } else if (selectedHunt.eventDate == null || selectedHunt.eventDate == '') {
      Alert.alert('Please enter a day for your event. It is fine if it is today or you only know an approximate date.')
    } else {
      this.props.screenProps.createScavengerHunt(selectedHunt)
    }
  }

  render() {
    let { goBack, navigate } = this.props.navigation;
    let { width, height } = Dimensions.get("window");
    let playerCountOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ,12 ,13, 14, 15]

    let selectedHunt = Object.assign({},this.props.navigation.state.params.selectedHunt)
    selectedHunt.teamName = this.state.teamName
    selectedHunt.prePaidPlayers = this.state.prePaidPlayers
    selectedHunt.eventDate = this.state.eventDate

    const Moment = require('moment');
    const MomentRange = require('moment-range');
    const moment = MomentRange.extendMoment(Moment);
    const start = moment()
    const end = moment().add(3, 'months')
    const range = moment.range(start, end)
    const arrayOfDates = Array.from(range.by('days'))

    console.log('The Registration Home Page is being Reloaded')
    console.log('The long description is')
    console.log(selectedHunt.long_description.replace(/<br>/ig, '').replace(/&nbsp;/ig,'').replace(/<p><\/p>/ig,'').replace(/<p[^>]*>[\s|&nbsp;]*<\/p>/,''))
    return (
    <Container style={{flex: 1, backgroundColor: 'white'}}>
       <LetsRoamHeader  
        handleDrawerPress={this.props.screenProps.handleDrawerPress}
      />
      <PageHeader  
              headerTitle={'4. Confirm your choice'}
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
          <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 30, marginRight: 10}}>
            {selectedHunt.theme + ' Hunt'}
          </Text>
        </View>
      </View> 
      <View style={{position: 'absolute', backgroundColor: 'rgba(217,217,214,1)', top: 70+35-20+130, height: 20, left: 0, right: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}} >
        <Text style={{color: '#505759', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center'}}>
            {'Starts At: '+ selectedHunt.starting_location.replace(/\d{5},\sU[^>]+/ig,'').replace(/\sUSA/,'').replace(/\sUnited\sStates/,'').replace(/[,;]$/,'').replace(/\s+$/,'')}
        </Text>
      </View> 
      <ScrollView style={{position: 'absolute', backgroundColor: 'white', top: 70+35-20+130+20, bottom: 0, left: 20, right: 20}} >
          <Text style={{color: '#E87722', fontFamily: 'Alternate Gothic No3 D', fontSize: 20, marginTop: 14, textAlign: 'center'}}>
            {('Create your hunt').toUpperCase()}
          </Text>
          {this.props.screenProps.user.info != null &&
            <View style={{alignItems: 'center'}}>
              <TextInput
                  style={{width: width-100, height: 40, borderColor: '#E87722', borderWidth: 1, marginTop: 10, paddingBottom: 5}}
                  textAlign={'left'}
                  placeholder="Enter a fun team name!"
                  value={this.state.teamName}
                  autoCorrect={false}
                  underlineColorAndroid={"#E87722" }
                  onChangeText={(teamName)=>this.setState({teamName})}
                />
                <Dropdown
                  label='How many players are you prepaying for?!'
                  data={playerCountOptions.map((item) => { return { value: item, label: item + " Prepaid Players", }; })}
                  containerStyle={{ textAlign: 'center', width: width-100, height: 55, paddingBottom: 5 }}
                  onChangeText={(prePaidPlayers)=>this.setState({prePaidPlayers})}
                />
                
                <Dropdown
                  label='Select your event date!'
                  data={arrayOfDates.map((date) => { return { value: date.format('L'), label: date.format('L'), }; })}
                  containerStyle={{ textAlign: 'center', width: width-100, height: 55, paddingBottom: 5 }}
                  onChangeText={(eventDate)=>this.setState({eventDate})}
                />
              <TouchableOpacity 
                  style = {{backgroundColor: '#E87722', height: 50, width: width-60, marginTop: 5, marginLeft: 10}} 
                  //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
                  onPress={() => this.createHuntPressed(selectedHunt)}
                >
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{color: 'white', fontSize: 25, marginLeft: 15, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}> CREATE YOUR HUNT</Text>
                  </View>
              </TouchableOpacity>

                <Text style={{color: '#505759', fontSize: 12, fontFamily: 'CircularStd'}}>
                  {'Event Cost: ' + (selectedHunt.huntPrice + selectedHunt.themePrice)*(this.state.prePaidPlayers || 1)+ ' Fox Coins'}
                </Text>

              <TouchableOpacity 
              style = {{backgroundColor: '#6AAEAA', height: 50, width: width-60, marginTop: 5, marginLeft: 10}} 
              //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
              onPress={this.props.screenProps.handleSignInPress}
              >
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{color: 'white', fontSize: 25, marginLeft: 15, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}> GET MORE COINS</Text>
              </View>
              </TouchableOpacity>

              <Text style={{color: '#505759', fontSize: 12, fontFamily: 'CircularStd'}}>
                  {'You have 0 Fox Coins'}
              </Text>

              <TouchableOpacity 
              style = {{backgroundColor: '#505759', height: 50, width: width-60, marginTop: 10, marginLeft: 10}} 
              //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
              onPress={this.props.screenProps.handleSignInPress}
              >
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{color: 'white', fontSize: 25, marginLeft: 15, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}> APPLY 3RD PARTY VOUCHER</Text>
              </View>
              </TouchableOpacity>
            </View>
            }
            {this.props.screenProps.user.info  == null &&
            <TouchableOpacity 
                style = {{backgroundColor: '#E87722', height: 50, width: width-60, marginTop: 40, marginLeft: 10}} 
                //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
                onPress={this.props.screenProps.handleSignInPress}
              >
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={{color: 'white', fontSize: 25, marginLeft: 15, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}> YOU MUST LOGIN TO PLAY </Text>
                </View>
            </TouchableOpacity>

            
          }
      </ScrollView>
    </Container>
    );
  }
};



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