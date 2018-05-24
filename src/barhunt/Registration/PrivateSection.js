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
import MyText from 'react-native-letter-spacing';

let { width, height } = Dimensions.get("window");

export default class extends Component {

  render() {
    return (
      <Container>
        {this.props.values.map(({text, action})=> {
          return (
            <BigButton text={text}  onPressHandler={action} />
          )
        })}
      </Container>
    );
  }
};


const BigButton = ({text, onPressHandler}) => (
  <LocationBoxCityContainer onPress={onPressHandler}>
    <MyText
      letterSpacing={0}
      textAlign="center"
      style={{
        fontSize: 28,
        color: "#464D4F"
      }}
    >{text}</MyText>
    <SeparateLine />
  </LocationBoxCityContainer>
)

const Container = styled.View`
  width: 95%;
  margin-top: 50px;
`;

const SeparateLine = styled.View`
  height: 3px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #304B51;
`;

const LocationBoxCityContainer = styled.TouchableOpacity`
  height: 60px;
  background-color: #1F9C9B;
  padding-top: 15px;
  width: 100%;
  margin-bottom: 20px;
`;

const DetailLocationText = styled.Text`
  font-size: 10px;
  color: #464E50;
  color: white;
  text-align: center;
`;
