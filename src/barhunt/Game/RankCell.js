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
  ImageBackground
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

import bluebg from '../../images/rank/bluebg.png';
import greybg from '../../images/rank/greybg.png';
import orangebg from '../../images/rank/orangebg.png';
import yellowbg from '../../images/rank/yellowbg.png';


export default class extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: null
    }
  };

  render() {
    let { item, index } = this.props;
    let { firstName, lastName, photoUrl, score, playerRank } = item;

    let fullName = `${firstName} ${lastName}`;

    let fullNameFontSize = 50;
    if (fullName.length > 16) {
      fullNameFontSize = 40;
    }

    let rankText = '';
    let bg = null;
    if (playerRank == 0) {
      bg = yellowbg;
      rankText = "1ST"; 
    } else if (playerRank == 1) {
      bg = greybg;
      rankText = "2ND";
    } else if (playerRank == 2) {
      bg = orangebg;
      rankText = "3RD";
    } else {
      bg = bluebg;
      rankText = `${playerRank + 1}TH`;
    }


    let heightImage = 58;

    return (
      <CellContainer style={{flex: 1}} onPress={this.props.onPress}>
        <Image
          style={{
            width: 478,
            height: 80,
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "transparent"
          }}
          resizeMode={"contain"}
          source={bg}
        >
        </Image>
        <View style={{
          // this is for making the grey space on the left the profile image
          // this layer, has the gray color background, is below the profile image layer, 
          // is a little wider the the profile image
          zIndex: 2, width: heightImage + 5, height: heightImage,
          position: "absolute",
          bottom: 1, right: 0,
          backgroundColor: "#464D4F"
        }}>
        </View>
        <Image
          style={{
            width: heightImage,
            height: heightImage,
            position: "absolute",
            bottom: 1,
            right: 0,
            zIndex: 3
          }}
          source={{ uri: photoUrl }}
        />
        <RankNumText>{rankText}</RankNumText>
        <NameText>{fullName}</NameText>
        <ScoreText>{score > 0 ? score : 0}</ScoreText>
      </CellContainer>
    )
  }

}

const CellContainer = styled.TouchableOpacity`
  height: 80;
  margin-bottom: 20;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
`;

const RankNumText = styled.Text`
  color: #464d4f;
  font-size: 28;
  position: absolute;
  top: 35;
  left: 12;
`;

const NameText = styled.Text`
  color: #464d4f;
  font-size: 25;
  position: absolute;
  top: 25;
  left: 70;
  width: 210;
  text-align: left;
`;

const ScoreText = styled.Text`
  color: #464d4f;
  font-size: 25;
  position: absolute;
  top: 50;
  left: 70;
  width: 210;
  text-align: left;

`;