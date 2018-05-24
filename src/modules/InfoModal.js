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
  ImageBackground
} from 'react-native';
import styled from 'styled-components';
import { getDatabase } from "../utils/db";       
import uuid from 'uuid/v4';
import google from '../utils/google';
import { facebookLogin } from "../utils/facebook";
import Icon from 'react-native-vector-icons/FontAwesome';
const Device = require('react-native-device-detection');
let { width, height } = Dimensions.get("window");

// calcualte image height and width
let imageWidth = width - 15 * 2;
let imageHeight = height - 15 * 2;


let { getGoogleSignin, isGoogleSessionExists } = google;
import Modal from 'react-native-modal';
import Swiper from 'react-native-swiper';

let bg1 = require("../images/barHuntInfoModal/bg1.jpg")
let bg2 = require("../images/barHuntInfoModal/bg2.jpg")
let bg3 = require("../images/barHuntInfoModal/bg3.jpg")

import ShadowText from './ShadowText';

const CloseButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 20;
  left: 20;
  z-index: 10;
`;

export default class extends Component {

  componentDidMount() {

    if ((Platform.OS != 'ios')) {
      // logic to refresh the modal after it is opened
    this.interval = setInterval(() => {
      if (this.props.show && !this.state.reloaded) {
        this.setState({ reloaded: true });
      } else if (!this.props.show && this.state.reloaded) {
        this.setState({ reloaded: false });
      }
        }, 100)
      }
    }
    

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  state = {
    reloaded: false
  }

  render() {

    let data = this.props.data;

    return (
      <Modal isVisible={this.props.show} transparent={this.transparent} style={{top: Device.isIphoneX ? 45 : 20}} >
        <View key={this.state.reloaded} style={{ flex: 1 }}>

          {/* close button*/}
          <CloseButtonContainer onPress={this.props.handleClose}>
            <Icon name="times" size={30} color="rgba(0, 0, 0, .5)" />
          </CloseButtonContainer>

          {/* swiper that switch cards */}
          <Swiper
            showsButtons={true}
            nextButton={
              <Icon name="chevron-right" size={30} color="rgba(0,0,0, 0.8)" />
            }
            prevButton={
              <Icon name="chevron-left" size={30} color="rgba(0,0,0, 0.8)" />
            }
            activeDotColor="red"
          >
            {
              data.map(({ bg, title, text }) => {
                return <ViewWithImage key={title} img={bg} label={title} text={text} />
              })
            }
          </Swiper>
        </View>
      </Modal>
    )
  }

};

// the individual view that being switched when clicked on switch button
const ViewWithImage = ({ img, label, text }) => (
  <View style={{ backgroundColor: "black", flex: 1 }}>

   {/* the image background */}
    <ImageBackground
      style={{ width: imageWidth, height: imageHeight, padding: 30, paddingTop: 60 }}
      source={img}
    >

     {/* the shadow text with container to give it a height (since shadow text does not have a height) */}
      <View style={{ height: 75, width: 300 }}>
        <ShadowText
          textColor="white"
          shadowColor="grey"
          text={label}
          textSize={45}
          textDecorationLine="underline"
        />
      </View>
      <ModalText>{text}</ModalText>
    </ImageBackground>
  </View>
)

const ModalText = styled.Text`
  font-size: 26;
  background-color: rgba(0,0,0,.7);
  color: white;
  margin-top: 40px;
  text-align: justify;
`;
