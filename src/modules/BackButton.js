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

const BackButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 10;
  left: 0;
`;

export default class extends Component {

  constructor() {
    super();
  }

  render() {
    let onPress = this.props.onPress;

    return (
      <BackButtonContainer
        onPress={onPress}
      >
        <Image
          style={{ width: 50, height: 30 }}
          source={require("../images/fox-flag.png")}
        />
      </BackButtonContainer>
    );
  }
};

