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

import RankIcon from '../../images/FOX_RANK_BUTTON.png';
import RankIconActivated from '../../images/FOX_RANK_BUTTON_activated.png';

export default class extends Component {

  render() {
    // 30 small
    // 40 big

    let imageWidth = 98 * 0.9;
    let imageHeight = 130 * 0.9;

    return (
      <NavButtonGroup>
        <NavButton onPress={this.props.barRoutePressed}>
          {this.props.selected == "BAR ROUTE" ?
            <NavButtonText style={{ fontSize: 30, borderBottomWidth: 7 }}>BAR ROUTE</NavButtonText> :
            <NavButtonText style={{ fontSize: 30, borderBottomWidth: 0 }}>BAR ROUTE</NavButtonText>
          }
        </NavButton>
        <NavButton onPress={this.props.rankPressed}>
          <View style={{width: imageWidth , height: imageHeight }}>
            <Image
              style={{ width: imageWidth, height: imageHeight }}
              source={this.props.selected == "RANK" ? RankIconActivated : RankIcon}
            />
          </View>
        </NavButton>
        <NavButton onPress={this.props.challengesPressed}>
          {this.props.selected == "CHALLENGES" ?
            <NavButtonText style={{ fontSize: 30, borderBottomWidth: 7 }}>CHALLENGES</NavButtonText> :
            <NavButtonText style={{ fontSize: 30, borderBottomWidth: 0 }}>CHALLENGES</NavButtonText>
          }
        </NavButton>
      </NavButtonGroup>
    );
  }
};


const NavButtonGroup = styled.View`
  flex-direction: row;
  margin-top: 10;
  height: 130px;
  justify-content: center;
`;

const NavButton = styled.TouchableOpacity`
  justify-content: flex-end;
  height: 130px;
`;

const NavButtonText = styled.Text`
  width: 130px;
  text-align: center;
  color: #1F9B99;
  border-bottom-width: 7px;
  border-bottom-color: #E26B22;
  padding-bottom: 5px;
`;