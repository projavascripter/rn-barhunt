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
  WebView
} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../images/logo.png");
let logo3 = require("../images/logo3.png");
import google from '../utils/google';
let { isGoogleSessionExists, getGoogleSignin } = google;
import {facebookLogin} from '../utils/facebook';
import fireUtil from '../utils/fireUtils';
let { getUserInfo } = fireUtil;
import { getDatabase } from "../utils/db";
import {facebookLogout} from "../utils/facebook";


let { width, height } = Dimensions.get("window");
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;


const initialUrl = 'https://www.scavengerhunt.com/book/letsroam.html';

export default class extends Component {

  
  static navigationOptions = {
    title: "Let's Roam Home"
  };

  constructor() {
    super();

    this.state = {
      url: initialUrl,
      selectedHunt: ''
    }
  }

  render() {
    
    let { navigate } = this.props.navigation;
    const { url } = this.state;
    return (
      <View style={{
        ...Platform.select({
            ios: {
              paddingTop: 24,
            },
            android: {
              paddingTop: 0,
            },
          }),
          flex: 1}}>
        {/*<Text style={{backgroundColor: 'black', color: 'white'}}>{ global.url }</Text>*/}
        <WebView
        ref={(ref) => { this.webview = ref; }}
        style={{ flex: 1}}
          source={{
            uri: 'https://www.scavengerhunt.com/book/letsroam.html'
          }}
          onNavigationStateChange={async(event) => {
            if (event.url.indexOf('players') > -1) { 
              let userId = await AsyncStorage.getItem("userId");
              let ticketNumber = event.url.substring(event.url.indexOf('code=')+5);
              let players = event.url.substring(event.url.indexOf('players=')+8);
              players = parseInt(players.substring(0, players.indexOf('&')))
              await fireUtil.setDataAtPath(`tickets/${ticketNumber}`,{ticketNumber: ticketNumber, playersMax: players, playersUsed: 0});
              fireUtil.setDataAtPath(`tickets/${ticketNumber}/users/${userId}`, true);
              this.props.navigation.goBack();
            }
        }}
          startInLoadingState
          scalesPageToFit
          javaScriptEnabled
        />
      </View>
    );
  }
    
};
