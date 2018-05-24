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
let containerSides = (width - 50) / 2;
import helpers from '../../utils/helpers';
let {getColorWithChallengeType} = helpers;

import ShadowText from '../../modules/ShadowText';

export default class extends Component {

  render() {
    let items = this.props.items;
    return (
      <ChallengesScrollView>
        <ChallengesContainer>
          {items != null &&
            items.map((challengeObj) => {

              let { challengeTitle, challengeType, completorPhotoUrl } = challengeObj;
              
              let bgColor = getColorWithChallengeType(challengeType);
              let imgUri = completorPhotoUrl;


              if (completorPhotoUrl != "photo/video") {
                imgUri = completorPhotoUrl;
              }

              return (
                <TouchableOpacity key={challengeTitle} onPress={() => {
                  this.props.cellPressHandler(challengeObj);
                }}>
                  <ChallengeBox
                    style={{
                      width: containerSides,
                      height: containerSides,
                      borderColor: bgColor,
                      backgroundColor: bgColor
                    }}
                    source={{ uri: imgUri }}
                  >
                    <ShadowText 
                      textColor="black"
                      shadowColor="#B6B6B6"
                      text={challengeTitle.toUpperCase()}
                    />
                  </ChallengeBox>
                </TouchableOpacity>
              )
            })
          }
        </ChallengesContainer>
      </ChallengesScrollView>
    );
  }
}

const ChallengesScrollView = styled.ScrollView`
  margin-left: 10;
  margin-right: 10;
  margin-top: 25;
`;

const ChallengesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const ChallengeBox = styled.ImageBackground`
  background-color: white;
  height: 100;
  margin-top: 10;
  margin-left: 10;
  border: 5px;
  padding: 10px;
  padding-bottom: 5;
`;
