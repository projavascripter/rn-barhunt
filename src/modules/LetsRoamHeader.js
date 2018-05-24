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
      <View style = {{backgroundColor: 'white', height: 55, width: width, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15}} >
        <TouchableOpacity onPress={() => Alert.alert('The shopping cart feature is still under development')} style={{  }}>
          <Image
            style={{ resizeMode: "cover", height: 1067/35, width: 900/35 }}
            source={require("../images/FOXBACKPAK.png")}
          />
        </TouchableOpacity>
        <Image
          style={{ resizeMode: "cover", height: 95*.43, width: 225*0.43 }}
          source={require("../images/logo4.png")}
        />
        <TouchableOpacity onPress={this.props.handleDrawerPress} style={{  }}>
            <Icon name="bars" size={30} color={'#E87722'} />
        </TouchableOpacity>
      </View>
    );
  }
};

