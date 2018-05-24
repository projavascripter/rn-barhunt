// Show hunt list so that the user can register or join

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  AsyncStorage,
  FlatList,
  TextInput,
  Platform,
  StatusBar,
  Linking,
  Keyboard
} from 'react-native';
import styled from 'styled-components';
import MyText from 'react-native-letter-spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../../images/logo.png");
let logo3 = require("../../images/logo3.png");
let logo4 = require("../../images/logo4.png");
import google from '../../utils/google';
let { isGoogleSessionExists, getGoogleSignin } = google;
import fireUtil from '../../utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;
import { getDatabase } from "../../utils/db";
import uuid from 'uuid/v4';

let { width, height } = Dimensions.get("window");

import BarHuntInfoModal from '../../modules/InfoModal';

import BackButton from '../../modules/BackButton';
import QuestionMarkButton from '../../modules/QuestionMarkButton';
import SmallButton from '../../modules/HomeSmallButton';
import LetsRoamHeader from '../../modules/LetsRoamHeader';
import PageHeader from '../../modules/PageHeader';


import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationActions } from 'react-navigation';




class ActionButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{ backgroundColor: this.props.backgroundColor, position: 'absolute', height: 60, bottom: this.props.bottomDistance, left: 52, right: 52 }}
        onPress={this.props.onPressButton}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ color: this.props.textColor, fontSize: 30, fontFamily: 'Alternate Gothic No1 D', textAlign: 'center' }}>
            {this.props.buttonText.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class extends Component {

  static navigationOptions = {
    header: null
  };

  constructor() {
    super();

    this.state = {
      showBarHuntInfoModal: false,
      mapRegion: null,
      lastLat: null,
      lastLong: null,
      locations: [],
      mapPositionUpdatedOnce: false,
      selectedMarker: '',
      previousHuntAuthCode: '',
      showJoin: false,
      frinedCode: '',
      error: null
    }
  }

  componentDidMount() {

      // for testing
      //this.props.navigation.navigate('RegistrationHuntList')
  }

  previousHuntDetected() {
    if (this.props.screenProps.user.info != null) {
      if (this.props.screenProps.user.info.currentScavengerHuntGroupId != null) {
        console.log('The previous auth code was ' + this.props.screenProps.user.info.currentScavengerHuntGroupId)
        console.log(this.props.screenProps.user.info);
        return (
          <ActionButton
            backgroundColor={'#E87722'}
            textColor={'white'}
            buttonText={'Continue Previous hunt'}
            bottomDistance={220}
            onPressButton={() => this.props.screenProps.updateAuthCode(this.props.screenProps.user.info.currentScavengerHuntGroupId)}
          />
        );
      }
    }
  }

  // handle question mark button click
  handleQuestionMarkPress = () => {
    this.setState({ showBarHuntInfoModal: true });
  }

  submitCode = () => {
    Keyboard.dismiss()
    let allAuthCodes = this.props.screenProps.allAuthCodes
    if (allAuthCodes != null) {
      allAuthCodes.map((authCode) => {
        console.log('The auth code is ', authCode.substring(0,5), 'the friend code is', this.state.friendCode)
        authCodeShort = typeof authCode != 'number' ? authCode.substring(0,5).toUpperCase() : authCode.substring(0,5)
        if (authCode.substring(0,5).toUpperCase() == this.state.friendCode) {
          this.setState({error: null})
          this.props.screenProps.joinEvent(authCode)
          return
        } else {
          
        }
      })
    } else {
      this.setState({error: 'Could not connect to the internet, please try again.'})
    }
    this.setState({error: 'We could not find your friends group. Please check your spelling.'})
  }

  render() {
    let { goBack, navigate } = this.props.navigation;
    let { width, height } = Dimensions.get("window");

    console.log('All the groups are: ' ,this.props.screenProps.allAuthCodes)

    return (
      <Container style={{ flex: 1, backgroundColor: '#D9D9D6' }}>
        <Modal isVisible={this.state.showJoin} transparent={true}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              
              <View style={{
                    height: 400,
                    width: 250,
                    backgroundColor: "white",
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 5,
                    alignItems: "center",
                    borderRadius: 5

                  }}>
                  <Title>Enter friends join code </Title>
                  {this.state.error != null &&
                    <Text style={{color: 'red', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center', marginTop: 5}}>
                        {this.state.error}
                    </Text>
                  }
                  <TextInput
                      style={{width: 220, height: 40, borderColor: '#E87722', borderWidth: 1, paddingBottom: 5}}
                      textAlign={'center'}
                      placeholder="A7689"
                      value={this.state.friendCode}
                      autoCorrect={false}
                      underlineColorAndroid={"#E87722" }
                      onChangeText={(friendCode)=>this.setState({friendCode})}
                    />
                  <Text style={{color: '#505759', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center', marginTop: 5}}>
                      {'After your friend finishes creating a scavenger hunt, you can join here. '}
                  </Text>
                  <TouchableOpacity
                    style={{backgroundColor: '#E87722', height: 40, marginTop: 20, width: 210, alignContent: 'center', justifyContent: 'center'}}
                    onPress={() => this.submitCode()}
                  >
                    <Text style={{color: 'white', fontSize: 25, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}>
                      {'Submit Code'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{backgroundColor: '#6AAEAA', height: 40, marginTop: 20, width: 210, alignContent: 'center', justifyContent: 'center'}}
                    onPress={() => this.setState({showJoin: false})}
                  >
                    <Text style={{color: 'white', fontSize: 25, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}>
                      {"Scan Friend's QR Code"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{backgroundColor: '#505759', height: 40, marginTop: 20, width: 210, alignContent: 'center', justifyContent: 'center'}}
                    onPress={() => this.setState({showJoin: false})}
                  >
                    <Text style={{color: 'white', fontSize: 25, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}>
                      {'Cancel'}
                    </Text>
                  </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <LetsRoamHeader
          handleDrawerPress={this.props.screenProps.handleDrawerPress}
        />
        <PageHeader
          headerTitle={'Start your scavenger hunt'}
          backgroundColor={'#53A6C4'}
          backAction={() => this.props.navigation.goBack()}
        />
        <Image
          style={{ resizeMode: "cover", height: height - 90, width: width }}
          source={require("../../images/registrationHomeImage.png")}
        />
        <View style={{ backgroundColor: 'rgba(232, 119, 34, .5)', position: 'absolute', height: height - 90, width: width, top: 90, left: 0 }}>
        </View>
        {this.previousHuntDetected()}
        <ActionButton
          backgroundColor={'white'}
          textColor={'#E87722'}
          buttonText={'Start a new Hunt'}
          bottomDistance={150}
          onPressButton={() => this.props.navigation.navigate('RegistrationHuntList')}
        />
        <ActionButton
          backgroundColor={'#6AAEAA'}
          textColor={'white'}
          buttonText={"Join a friend's hunt"}
          bottomDistance={80}
          onPressButton={() => this.setState({showJoin: true})}
        />
        <ActionButton
          backgroundColor={'#505759'}
          textColor={'white'}
          buttonText={'Find Hunt Locations'}
          bottomDistance={10}
          onPressButton={() => this.props.navigation.navigate('RegistrationHuntList')}
        />

      </Container>
    );
  }
};

const CenterText = styled.Text`
  text-align: center;
`;

const Container = styled.View`
  background-color: #D9D9D6;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;


const BackButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 10;
  left: 0;
`;
const Title = styled.Text`
  font-size: 25px;
  text-align: center;
  color: #E36B21;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ThreeButtonGroup = styled.View`
  flex-direction: row;
  margin-top: 5px;
  height: 70px;
  justify-content: space-between;

`;