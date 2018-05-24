// hunt list flat list
// used in bar hunt list screen

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

import BarHuntInfoModal from '../../modules/InfoModal';

const CenterText = styled.Text`
  text-align: center;
`;

export default class extends Component {
  render() {

    return (
      <FlatList
        style={{ marginTop: 50, width: "95%" }}
        data={this.props.barHuntData}
        keyExtractor={(item, index) => String(item.id)}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => {
              this.props.cellPressHandler(item)
            }}>
              <Cell item={item} />
            </TouchableOpacity>
          )
        }}
      />
    );
  }
};

const CellContainer = styled.View`
  width: 100%;
  height: 73px;
  margin-bottom: 15px;
  flex-direction: row;
`;

// left part

const CellDateBox = styled.View`
  margin-right: 5px;
  width: 75px;
`;

const TimeBox = styled.View`
  height: 60px;
  background-color: #E36B21;
`;

const XDayText = styled.Text`
  padding: 3px;
  font-size: 10px;
  text-align: left;
  color: #1F9C9B;
`;

const DetailDateLine = styled.View`
  height: 30px;
  background-color: #E46B21;
  padding-left: 5px;
`;

const DetailDateLineText = styled.Text`
  font-size: 28px;
  color: #3E4C4F;
  text-align: center;
`;

const SeparateLine = styled.View`
  height: 2px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #304B51;
`;

// right part

const LocationBox = styled.View`
  flex-grow: 2;
`;

const LocationBoxCityContainer = styled.View`
  height: 60px;
  background-color: #1F9C9B;
  padding-top: 5px;
  padding-left: 0;
  padding-right: 10px;
`;

const CityText = styled(Text) `  
  font-family: "Alternate Gothic No1";
  font-weight: 400;
  font-size: 30px;
  margin-top: -5px;
  margin-bottom: -5px; 
  color: #464D4F;
  text-align: right;
  padding-right: 15px;
`;

const DetailLocationText = styled.Text`
  font-size: 10px;
  color: #464E50;
  color: white;
  text-align: right;
`;

const OrganizedByText = styled.Text`
  font-size: 10px;
  text-align: right;
  padding-right: 0;
  color: #435456;
`;

// Cell
const Cell = ({ item }) => {
  let { title } = item;
  title = title.toUpperCase();

  // calculate date text
  let date = item.date;

  let startDateText = moment(date).format("MMM DD").toUpperCase();
  let inXDayText = `In ${moment(moment(date)).diff(moment(), "days")} Days`;

  return (
    <CellContainer>
      <CellDateBox>
        <TimeBox>
          <DetailDateLine>
            <DetailDateLineText>{startDateText}</DetailDateLineText>
          </DetailDateLine>
          <SeparateLine>
          </SeparateLine>
          <DetailDateLine>
            <DetailDateLineText style={{ fontSize: 23 }}>{item.startTime}</DetailDateLineText>
          </DetailDateLine>
        </TimeBox>
        <XDayText>
          {inXDayText}
        </XDayText>
      </CellDateBox>
      <LocationBox>
        <LocationBoxCityContainer>
          <MyText
            letterSpacing={0}
            textAlign="right"
            style={{
              fontSize: 33,
              color: "#464D4F"
            }}
          >{title}</MyText>
          <SeparateLine style={{ height: 3, marginRight: 0 }} />
          <OrganizedByText>Organized by Let's Roam</OrganizedByText>
        </LocationBoxCityContainer>
        <DetailLocationText>{item.address}</DetailLocationText>
      </LocationBox>
    </CellContainer>
  )
}
