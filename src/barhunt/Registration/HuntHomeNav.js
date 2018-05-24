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
  FlatList
} from 'react-native';
import styled from 'styled-components';
import MyText from 'react-native-letter-spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../../images/logo.png");
let logo3 = require("../../images/logo3.png");
import { getFacebookCredentials, facebookLogin } from "../../utils/facebook";
import google from '../../utils/google';
let { isGoogleSessionExists, getGoogleSignin } = google;
import fireUtil from '../../utils/fireUtils';
let { getUserInfo } = fireUtil;
import { getDatabase } from "../../utils/db";
import uuid from 'uuid/v4';
import moment from 'moment';

let { width, height } = Dimensions.get("window");



export default class extends Component {

  render() {
    // 30 small
    // 40 big

    return (
      <NavButtonGroup >
        <NavButton onPress={this.props.privatePressed} style={{width: width/3}}>
          {this.props.selected == "PRIVATE" ?
            <Image style={{ width: width/3, height: width/3, flex: 1 }} source={require("../../images/private_selected.png")}/> :
            <Image style={{ width: width/3, height: width/3, flex: 1 }} source={require("../../images/private.png")}/>
          }
        </NavButton>
        <NavButton onPress={this.props.publicPressed} style={{width: width/3}}>
          {this.props.selected == "PUBLIC" ?
            <Image style={{ width: width/3, height: width/3, flex: 1 }} source={require("../../images/public_selected.png")}/> :
            <Image style={{ width: width/3, height: width/3, flex: 1 }} source={require("../../images/public.png")}/>
          }
        </NavButton>
        <NavButton onPress={this.props.myEventsPressed} style={{width: width/3}}>
          {this.props.selected == "MY EVENTS" ?
            <Image style={{ width: width/3, height: width/3, flex: 1 }} source={require("../../images/my_events_selected.png")}/> :
            <Image style={{ width: width/3, height: width/3, flex: 1 }} source={require("../../images/my_events.png")}/>
          }
        </NavButton>
      </NavButtonGroup>
    );
  }
};


const NavButtonGroup = styled.View`
  flex-direction: row;
  flex: 1;
`;

const NavButton = styled.TouchableOpacity`
  justify-content: flex-end;
  flex: 1;
`;