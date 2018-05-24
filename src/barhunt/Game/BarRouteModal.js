

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
  ScrollView
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

const BackButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 20;
  left: 20;
  z-index: 10;
  margin-left: 5;
`;

export default class extends Component {

  render() {

    let item = this.props.data;
    let { barImageName, barName, barTimes, barDescription } = item;
    let uri = `https://www.scavengerhunt.com/barHuntImages/${barImageName}.jpg`;
    if (barName != null) {
      if (barName.length > 25) {
        fontSize = 35
      } else if (barName.length > 20) {
        fontSize = 40
      } else if (barName.length > 15) {
        fontSize = 45
      } else {
        fontSize = 50
      }
    } else {
      fontSize = 50
    }
    

    return (
      <Modal isVisible={this.props.show} transparent={true}  style={{ margin: 0, backgroundColor: "#FFFFFF"}}>
       <View style={{ position: 'absolute', width: width, height: 200, top: ((Device.isIphoneX ? 44 : 0) + (Platform.OS === 'ios') ? 20 : 0), left: 0, backgroundColor: "#FFFFFF" }}>
          <Image style={{ flex: 1, alignSelf: 'stretch', width: width, height: height, }} resizeMode={'cover'} source={{ uri: `https://www.scavengerhunt.com/barHuntImages/${barImageName}.jpg` }} />
        </View>
        <View style={{ position: 'absolute', width: width, height: 200, top: ((Device.isIphoneX ? 44 : 0) + (Platform.OS === 'ios') ? 20 : 0), left: 0, backgroundColor: "rgba(0,0,0,0.6)" }}>
            <BackButton
              onPress={this.props.handleClose}
            />
            <BarTitle
              numberOfLines={1}
              style={{fontSize: fontSize}}
              
            >{barName != null ? barName.toUpperCase(): barName}
          </BarTitle>
          <BarTimeText style={{color: '#E87722', fontSize: 25}} >{barTimes}</BarTimeText>
        </View>
        <View style = {{ position: 'absolute', backgroundColor: '#D9D9D6', width: width, height: height-200, top: ((Device.isIphoneX ? 44 : 0) + (Platform.OS === 'ios') ? 200 : 200), left: 0 }}>
          <ScrollView style = {{ flex: 1 }} >
            <HeaderText style={{ marginTop: 10 }}>
                    {'About This Bar'}
            </HeaderText>
            <BodyText>
                    {barDescription}
            </BodyText>
            <HeaderText>
                    {'When to move on'}
            </HeaderText>
            <BodyText>
                    {'Once you all finish most of the challenges it is time to move on. We find voting is the best way to decide when to move.'}
            </BodyText>
            <View>
                <TouchableOpacity style={{ alignSelf: "center", marginTop: 20,  height: 45, marginBottom: 10 }} onPress={this.props.changeBarHandler}>
                        <ButtonText>{'MOVE ON TO THIS BAR'}</ButtonText>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: "center", marginTop: 0,  height: 45, marginBottom: 100 }} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query='.concat(item.barAddress.replace(' ', '+')))}>
                        <ButtonText style={{backgroundColor: '#FFC600'}}>{'DIRECTIONS'}</ButtonText>
                </TouchableOpacity>
              {/* <TouchableOpacity style={{ alignSelf: "center" }}>
                <ImHereButtonText onPress={this.props.changeBarHandler}>WE ARE HERE!</ImHereButtonText>
                 </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query='.concat(item.barAddress.replace(' ', '+')))} style={{ alignSelf: "center", marginTop: 10 }}>
                  <DirectionsButtonText>Directions</DirectionsButtonText>
                 </TouchableOpacity> */}
               </View>
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
  text-align: center;
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
const ImHereButtonText = styled.Text`
  padding: 10px;
  background-color: #e87722;
  color: white;
  font-size: 40;
  width: 200;
  text-align: center;
`;

const DirectionsButtonText = styled.Text`
  padding: 10px;
  background-color: #ffc600;
  color: white;
  font-size: 20;
  width: 150;
  text-align: center;
`;