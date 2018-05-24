// show the detail of hunt, and user can register and join a hunt

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
  Linking,
  ScrollView,
  StatusBar
} from 'react-native';
import styled from 'styled-components';
import { getDatabase } from "../../utils/db";
import uuid from 'uuid/v4';
import google from '../../utils/google';
let { getGoogleSignin, isGoogleSessionExists } = google;
import { facebookLogin } from "../../utils/facebook";
import Icon from 'react-native-vector-icons/FontAwesome';
let { width, height } = Dimensions.get("window");
import Modal from 'react-native-modal';
import BackButton from '../../modules/BackButton';

import ModalCloseButton from '../../modules/ModalCloseButton';
import ShadowText from '../../modules/ShadowText';
const Device = require('react-native-device-detection');

const styles = StyleSheet.create({
  statusBarBackground: {
    marginTop: (Platform.OS === 'ios') ? 20 : 0, //this is just to test if the platform is iOS to give it a height of 20, else, no height (Android apps have their own status bar)
    color: '#FFFFFF'
  },
  modalStatusBarBackground: {
    top: (Platform.OS === 'ios') ? 20 : 0, //this is just to test if the platform is iOS to give it a height of 20, else, no height (Android apps have their own status bar)
    color: '#FFFFFF'
  }

})

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const BackButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 20;
  left: 20;
  z-index: 10;
  margin-left: 5;
`;

export default class extends Component {

  render() {

    let { show, handleClose, modalButtonAction, modalButtonActionText, huntObj } = this.props;
    let { title, description, date, startTime, image } = huntObj;

    if (title != null) {
      if (title.length > 25) {
        fontSize = 35
      } else if (title.length > 20) {
        fontSize = 40
      } else if (title.length > 15) {
        fontSize = 45
      } else {
        fontSize = 50
      }
    } else {
      fontSize = 50
    }

    return (
      <Modal  key={modalButtonActionText} isVisible={this.props.show} transparent={true}  style={{ margin: 0, backgroundColor: "#464D4F"}}>
          <View style={{ position: 'absolute', width: width, height: 200, top: ((Device.isIphoneX ? 44 : 0) + (Platform.OS === 'ios') ? 20 : 0), left: 0, backgroundColor: "#FFFFFF" }}>
            <Image style={{ flex: 1, alignSelf: 'stretch', width: width, height: height, }} resizeMode={'cover'} source={{ uri: `https://www.scavengerhunt.com/barHuntImages/${image}.jpg` }} />
          </View>
          <View style={{ position: 'absolute', width: width, height: 200, top: ((Device.isIphoneX ? 44 : 0) + (Platform.OS === 'ios') ? 20 : 0), left: 0, backgroundColor: "rgba(0,0,0,0.6)" }}>
            <BackButton
                onPress={this.props.handleClose}
            />
            <BarTitle
              numberOfLines={1}
              style={{fontSize: fontSize}}  
              >{title != null ? title.toUpperCase(): title}
              </BarTitle>
            <BarTimeText>{startTime}</BarTimeText>
          </View>
          <View style = {{ position: 'absolute', backgroundColor: '#D9D9D6', width: width, height: height-200, top: ((Device.isIphoneX ? 44 : 0) + (Platform.OS === 'ios') ? 200 : 200), left: 0 }}>
            <ScrollView style = {{ flex: 1 }} >
              <HeaderText style={{ marginTop: 10 }}>
                      {'About This Crawl'}
              </HeaderText>
              <BodyText>
                      {description}
              </BodyText>
              <HeaderText>
                      {'About Public Bar Crawls'}
              </HeaderText>
              <BodyText>
                      {'This is a fun and competive bar crawl that goes to 4 different bars. At each bar you will compete with your fellow bar hunters to take photos, complete wacky challenges, and in tournament style games. Be prepared to make friends along the way.'}
              </BodyText>
              <HeaderText>
                      {'Scoring for this Bar Crawl'}
              </HeaderText>
              <BodyText>
                      {'You earn points by being the first to those photo challenges, dare type challenges, and winning tournaments. The first person to complete them get the full amount of points, while subsequent completions earn less points.'}
              </BodyText>
              <HeaderText>
                      {'Getting Started'}
              </HeaderText>
              <BodyText>
                      {' This event is on '+ date + ', please meet up 15 minutes before the event with fellow hunters. The app will serve as your guide and your fellow hunters as your judge. At 15 minutes before you will be able to join the event. If you have any issues call up our support. '}
              </BodyText>
              <HeaderText>
                      {'Moving Between Bars'}
              </HeaderText>
              <BodyText>
                      {'All times to move between the bars are only recommendations. Some nights a certain bar may be popping, people may be finishing their beverages, or the vibe may be perfect. Decide as a group when to move to the next bar. If you all decided to stay at a bar for extra time feel free to change to a new challenge pack.'}
              </BodyText>
              <TouchableOpacity style={{ alignSelf: "center", marginTop: 45,  height: 45, marginBottom: 100 }} onPress={modalButtonAction}>
                      <ButtonText>{modalButtonActionText != null ? modalButtonActionText.toUpperCase() : modalButtonActionText}</ButtonText>
              </TouchableOpacity>
            </ScrollView>
          </View>
            {/* <View style={{ flex: 1, borderColor: "#505759", borderWidth: 8, padding: 10 }}>
              <ScrollView>
                <View style={{ height: 75, width: 300, marginTop: 50 }}>
                  <ShadowText
                    textColor="white"
                    shadowColor="grey"
                    text={title}
                    textSize={45}
                    textDecorationLine="underline"
                  />
                </View>
                <Text style={{ color: 'white', fontSize: 25, marginBottom: 50 }}>
                  {description}
                </BodyText>
                <Text style={{ color: 'white', fontSize: 25, marginBottom: 50 }}>
                  {'At: ' + startTime + ' ' + date}
                </BodyText>
                
              </ScrollView>
            </View> */}
      </Modal>
    )
  }

};

const HeaderText = styled.Text`
  color: #E87722;
  font-size: 25;
  margin-top: 20;
  margin-left: 5;
  margin-right: 5;
  margin-bottom: 0;
  text-align: center;
  font-family: 'Alternate Gothic No3 D';
`;
const BodyText = styled.Text`
  color: black;
  font-size: 16;
  margin-top: 5;
  margin-left: 12;
  margin-right: 12;
  margin-bottom: 0;
  text-align: justify;
  font-family: 'CircularStd-Black';
`;

const ButtonText = styled.Text`
  padding: 10px;
  background-color: #e87722;
  color: white;
  font-size: 16;
  width: 200;
  justify-content: center;
  text-align: center;
  font-family: 'Alternate Gothic No3 D';
  font-weight: 600;
`;

const BarTitle = styled.Text`
  position: absolute;
  top: 50;
  left: 5;
  right: 5;
  height: 50;
  color: rgba(255,255,255, 1);
  text-align: right;
`;

const BarTimeText = styled.Text`
  position: absolute;
  top: 100;
  left: 5;
  right: 5;
  height: 40;
  color: #E06A21;
  font-size: 35px;
  font-weight: 500;
  text-align: right;
`;