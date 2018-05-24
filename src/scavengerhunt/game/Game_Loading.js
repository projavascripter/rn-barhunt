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
  ActivityIndicator
} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../../images/logo.png");
let logo3 = require("../../images/logo3.png");

import axios from 'axios';


let { width, height } = Dimensions.get("window");


const CenterText = styled.Text`
  text-align: center;
`;



const Container = styled.View`
  background-color: #E56B1F;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 30px;
  padding-right: 30px;
`;

const ButtonsContainer = styled.View`
  margin-top: 35px;
  width: 100%;
`;

const LongButtonView = styled.View`
  width: 100%;
  height: 70px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const ThreeButtonGroup = styled.View`
  flex-direction: row;
  margin-top: 5px;
  height: 70px;
  justify-content: space-between;

`;

const ColorfullNameView = styled.View`
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #474D4F;
  align-self: flex-start;
`;

const ColorfulNameText = styled.Text`
  color: #E16B1E;
  align-self: center
`;

const Title = styled.Text`
  font-size: 25px;
  text-align: center;
  color: #E36B21;
  margin-top: 20px;
  margin-bottom: 20px;
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
      loggedIn: false,
      userInfo: {},
      showLoginModal: false,
      showInfoModal: false,
      allTickets: null,
      playerTicket: null,
      playTestMode: false,
      showFindFriendTicket: false,
      voucherInputText: ""
    }
  }

  componentDidMount(){
    console.log('The hunt data is now loading!')
    let dataURL = 'https://www.scavengerhunt.com/app/ios_ajax_json_hunt_stops.php?password=asf4fvadfv31das&ahid='+this.props.screenProps.groupInfo.huntId;
    console.log('The data url is: ' + dataURL)
    axios.get(dataURL)
    .then(response => {
      global.huntQuestionData = Object.values(response.data); 
      console.log('The hunt question data is: ')
      console.log(Object.values(response.data));
      this.props.screenProps.updateHuntData(Object.values(response.data));
    })
    .catch(function (error) {
      Alert.alert(error);
    });;
  }

  render() {

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#E87722'}}>
        <ScrollView style={{ flex: 1, marginTop: (Platform.OS === 'ios') ? 0 : 20 }}>
          <Container style={{ height: 1000 }}>

            <Image
              style={{ height: 200 * 0.8, width: 146 * 0.8 }}
              source={logo}
            />
            <Image
              style={{ height: 95, width: 225, marginTop: 20 }}
              source={logo3}
            />
            <Text style={{marginTop: 20, color: 'white', fontSize: 20, fontFamily: 'CircularSTD-Black'}}> Your Scavenger Hunt is Loading! </Text>
            <ActivityIndicator 
              size="large" 
              color="white" 
              style={{marginTop: 20}}
            />
          </Container>
        </ScrollView>
      </SafeAreaView>
    );
  }
};