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

export default class extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: null
    }
  };

  render() {
    let {item, index} = this.props;
    let {barName, barImageName} = item;

    let titleSize = 50;
    if (barName != null) {
      if (barName.length > 25) {
        fontSize = 30
      } else if (barName.length > 20) {
        fontSize =  30
      } else if (barName.length > 15) {
        fontSize = 35
      } else {
        fontSize = 40
      }
    } else {
      fontSize = 40
    }

    return (
      <CellContainer onPress={this.props.onPress}>
        <IndexBoxText>Bar {index+1}</IndexBoxText>
        <Bg source={{ uri: `https://www.scavengerhunt.com/barHuntImages/${barImageName}.jpg` }}>
          <BgOverlay>
            <BarTitle
              numberOfLines={1}
              style={{fontSize: fontSize}}
            >{item.barName.toUpperCase()}</BarTitle>
            <BarTimeText>{item.barTimes.substring(0, item.barTimes.indexOf('M')+1)}</BarTimeText>
          </BgOverlay>
        </Bg>
        <AddressText>{item.barAddress}</AddressText>
      </CellContainer>
    )
  }

}

const CellContainer = styled.TouchableOpacity`
  margin-bottom: 25;
  align-items: flex-start;
  padding-left: 13;

`;

const Bg = styled.ImageBackground`
  width: 95%;
  background-color: grey;
  height: 140;
  flex-direction: column;
`;

const BgOverlay = styled.View`
  background-color: rgba(0,0,0, .35);
  height: 100%;
  width: 100%;
  padding-top: 30px;
  padding-right: 20;
  padding-left: 20;
`;

const BarTitle = styled.Text`
  color: rgba(255,255,255, 1);
  text-align: right;
`;

const BarTimeText = styled.Text`
  color: #E06A21;
  font-size: 35px;
  font-weight: 500;
  text-align: right;
`;

const IndexBoxText = styled.Text`
  background-color: #1F9C9A;
  position: absolute;
  top: 5;
  left: 5;
  z-index: 10;
  width: 80;
  padding-top: 3;
  padding-bottom: 3;
  text-align: center;
  color: #48484A;
`;

const AddressText = styled.Text`
  font-size: 20px;
  color: #B3B3B3;
  padding-right: 5%;
  align-self: flex-end;
`;