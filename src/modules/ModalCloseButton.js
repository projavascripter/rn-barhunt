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
  AsyncStorage,
  Image,
  Dimensions,
  Linking
} from 'react-native';
import styled from 'styled-components';
import { getDatabase } from "../utils/db";
import uuid from 'uuid/v4';
import google from '../utils/google';
let { getGoogleSignin, isGoogleSessionExists } = google;
import { facebookLogin } from "../utils/facebook";
import Icon from 'react-native-vector-icons/FontAwesome';
let { width, height } = Dimensions.get("window");

const BackButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 20;
  left: 20;
  z-index: 10;
  margin-left: 5;
`;

export default class extends Component {

  render() {
    let { onPress, color = "rgba(255, 255, 255, .5)" } = this.props;

    return (
      <BackButtonContainer onPress={onPress}>
        <Icon name="times" size={40} color={color} />
      </BackButtonContainer>
    )
  }

};
