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
  ScrollView,
  ImageBackground
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
let { getUserInfo } = fireUtil;
import { getDatabase } from "../utils/db";
import uuid from 'uuid/v4';
import moment from 'moment';
let { width, height } = Dimensions.get("window");

export default class extends Component {
  render() {
    let { textColor, shadowColor, text, textSize = 35 } = this.props;

    return (
      <ShadowTextContainer>
        <ChallengeTitle style={{ top: 2, left: 2, color: shadowColor, fontSize: textSize}}>{text}</ChallengeTitle>
        <ChallengeTitle style={{ top: 0, left: 0, color: textColor, fontSize: textSize}}>{text}</ChallengeTitle>
      </ShadowTextContainer>
    )
  }
}

const ShadowTextContainer = styled.View`
  flex: 1;
`;

const ChallengeTitle = styled.Text`
  color: #BCB8B8;
  position: absolute;
`;