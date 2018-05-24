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

const QuestionIconContainer = styled.TouchableOpacity`
  position: absolute;
  right: 15;
  top: 11;
`;

export default class extends Component {

  render() {
    let {color = "rgba(255, 255, 255, .6)"} = this.props;
    return (
      <QuestionIconContainer style={this.props.styles} onPress={this.props.onPress}>
        <Icon name="question-circle" size={20} color={color} />
      </QuestionIconContainer>
    );
  }
};

