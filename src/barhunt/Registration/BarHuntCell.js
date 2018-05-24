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

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: null
    }
  };

  render() {
    let {item, index} = this.props;
    let {title, barImageName, image, barName} = item;

    if (title != null) {
      if (title.length > 25) {
        fontSize = 30
      } else if (title.length > 20) {
        fontSize =  30
      } else if (title.length > 15) {
        fontSize = 35
      } else {
        fontSize = 40
      }
    } else {
      fontSize = 40
    }
    console.log('The width is' + this.width);
    if(this.width < 400){
      fontSize = fontSize - Math.roundToNearestPixel((500-this.width)/10)
    }

    let date = item.date;
    let startDateText = moment(date).format("MMM DD").toUpperCase();
    let inXDayText = `In ${moment(moment(date)).diff(moment(), "days")} Days`;

    let objCount=0;
    for(_obj in item.registeredPlayers) objCount++;  




    return (
      <CellContainer style={{flex: 1}}>
        <IndexBoxText>{startDateText}</IndexBoxText>
        <AvailabilityText>{item.registeredPlayers != null ? `${item.maxPlayers - objCount} Players Remaining` : 'Limited Availibility'}</AvailabilityText>
        <Bg style={{width: width-25}} source={{ uri: `https://www.scavengerhunt.com/barHuntImages/${image}.jpg` }}>
          <BgOverlay>
            <BarTitle
              numberOfLines={1}
              style={{fontSize: fontSize}}
            >{item.title.toUpperCase()}</BarTitle>
            <BarTimeText>{item.startTime}</BarTimeText>
          </BgOverlay>
        </Bg>
        <AddressText>{'Starts at: '+item.address}</AddressText>
      </CellContainer>
    )
  }

}

const CellContainer = styled.View`
  margin-bottom: 25;
  align-items: flex-start;


`;

const Bg = styled.ImageBackground`
  width: 100%;
  background-color: grey;
  height: 140;
  flex-direction: column;
`;

const BgOverlay = styled.View`
  background-color: rgba(0,0,0, .35);
  height: 100%;
  width: 100%;
  padding-top: 30px;
  padding-right: 5px;
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
  background-color: #E87722;;
  position: absolute;
  top: 20;
  left: 5;
  height: 25;
  z-index: 10;
  width: 60;
  padding-top: 3;
  padding-bottom: 3;
  text-align: center;
  color: #48484A;
  font-weight: 400;
`;

const BarCountText = styled.Text`
  background-color: #1F9C9A;
  position: absolute;
  top: 105;
  left: 5;
  height: 30;
  z-index: 10;
  width: 60;
  padding-top: 3;
  padding-bottom: 3;
  text-align: center;
  color: #48484A;
  numberOfLines={2}
  font-size: 12;
`;

const AddressText = styled.Text`
  font-size: 15px;
  color: #B3B3B3;
  padding-right: -10%;
  align-self: flex-end;
`;

const AvailabilityText = styled.Text`
  font-size: 12px;
  color: #B3B3B3;
  padding-right: -10%;
  align-self: flex-end;
`;