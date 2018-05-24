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
} from 'react-native';
import styled from 'styled-components';
import MyText from 'react-native-letter-spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../images/logo.png");
let logo3 = require("../images/logo3.png");
import { getFacebookCredentials, facebookLogin } from "../utils/facebook";
import google from '../utils/google';
let { isGoogleSessionExists, getGoogleSignin } = google;
import fireUtil from '../utils/fireUtils';
let { getUserInfo, getDataAtPath } = fireUtil;
import { getDatabase, get } from "../utils/db";
import uuid from 'uuid/v4';
import moment from 'moment';

let { width, height } = Dimensions.get("window");


export default class extends Component {

  render() {
    let {color = "rgba(255, 255, 255, .6)"} = this.props;
    return (
      <View style = {{backgroundColor: this.props.backgroundColor, height: 35, width: width, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15}} >
        <TouchableOpacity onPress={this.props.backAction} style={{  }}>
          <Image
            style={{ resizeMode: "cover", height: 19, width: 19 }}
            source={require("../images/BackButton.png")}
          />
        </TouchableOpacity>
        <Text style={{color: 'white', fontFamily: 'Alternate Gothic No1 D', fontSize: 24}}>
          {this.props.headerTitle.toUpperCase()}
        </Text>
        <Icon name="bars" size={30} color={this.props.backgroundColor} />
      </View>
    );
  }
};


