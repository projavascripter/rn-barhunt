// Show hunt list so that the user can register or join
//android permisions for geolocation
//https://facebook.github.io/react-native/docs/permissionsandroid.html

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
  PermissionsAndroid,
  ScrollView
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
import LetsRoamHeader from '../../modules/LetsRoamHeader'
import PageHeader from '../../modules/PageHeader'

import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationActions } from 'react-navigation';
import StarRatingBar from 'react-native-star-rating-view/StarRatingBar'


import { connect } from 'react-redux';
import { retrieveHuntList } from '../../redux/actions/hunts.actions';
import QRCode from 'react-native-qrcode';


export default class List extends Component {

  static navigationOptions = {
    header: null
  };

  constructor() {
    super();

    this.state = {

    }
  }

  render() {
    let { width, height } = Dimensions.get("window");
    let groupInfo = this.props.groupInfo;

    return (
    
    <Container style={{flex: 1, backgroundColor: 'white'}}>
       <LetsRoamHeader  
        handleDrawerPress={this.props.screenProps.handleDrawerPress}
      />
      <PageHeader  
              headerTitle={('Team: '+ groupInfo.teamName).toUpperCase().substring(0,25)}
              backgroundColor={'#53A6C4'}
              backAction={() => this.props.screenProps.updateAuthCode(null)}
      /> 
      <View style={{position: 'absolute', top: 70+35-20, height: 100, left: 0, right: 0}} >
        <Image source={{uri: groupInfo.huntPhoto}}
        style={{flex: 1, height: 130}} />
      </View> 
      
      <View style={{position: 'absolute', backgroundColor: 'rgba(80,87,89,0.5)', top: 70+35-20, height: 100, left: 0, right: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}} >
        <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 40, textAlign: 'center'}}>
          {groupInfo.huntName}
        </Text>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
          <View style = {{height: 5, width: 60}} />
          <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 30, textAlign: 'center', marginRight: 20}}>
            {groupInfo.theme + ' Hunt'+ '       '}
          </Text>
        </View>
      </View> 
      <ScrollView style={{position: 'absolute', top: 70+35-20+100, bottom: 0, left: 20, right: 20}} >
          <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No1 D', fontSize: 31, marginLeft: 5, marginTop: 10, textAlign: 'left'}}>
            {('Select your character').toUpperCase()}
          </Text>
          <View style={{width: width-40, height: 3,backgroundColor: '#505759'}} />
          <Character
          width={width}
          character={"explorer"}
          description={'The explorer sees the world. In this role you will see a ton! Expect a equal mix of dares, challenges, and photos.'}
          source={require('../../images/explorerIcon.png')}
          screenProps={this.props.screenProps}
          />
          <Character
          width={width}
          character={"branaic"}
          description={'The brainiac is super smart. In this role your custom chllanges will rock! Expect a bit more trivia!'}
          source={require('../../images/branaicIcon.png')}
          screenProps={this.props.screenProps}
          />
          <Character
          width={width}
          character={"photographer"}
          description={'The photographer character has unique fun photo challenges that will be great for the memory books!'}
          source={require('../../images/photographerIcon.png')}
          screenProps={this.props.screenProps}
          />
          <Character
          width={width}
          character={"youngster"}
          description={'The youngster totally rocks. This role is perfect for kids!'}
          source={require('../../images/youngsterIcon.png')}
          screenProps={this.props.screenProps}
          />
          <Character
          width={width}
          character={"student"}
          description={'The student loves trivia and learning about the world! Have fun with unique challenges that will help you learn about stuff.'}
          source={require('../../images/studentIcon.png')}
          screenProps={this.props.screenProps}
          />
          <View style={{height: 40, width: 100}} />
      </ScrollView>
    </Container>
    );
  }
  objectValues = (object) => {
    if (object != null) {
      if (object.groupId == null) {
        console.log('the evaluated object is: '); console.log(object)
        return Object.values(object)
      }
    }
    return object
  }
};

class Character extends Component {

  constructor() {
    super();

    this.state = {
      selected: false
    }
  }

  render() {
    console.log('the photo url is', this.props.userPhoto)
    return (
      <View style={{width: this.props.width-40, height: 130, marginTop: 20}} >
        <View style={{position: 'absolute', right: 0, top:7, width: width-40-71, bottom: 0, backgroundColor: '#D9D9D6'}}>
          <Text style ={{marginLeft: 76, marginRight: 5}}>
            {this.props.description}
          </Text>

          <TouchableOpacity 
            style={{position: 'absolute', right: 5, bottom: 5, height: 25, width: 130, backgroundColor: '#D9D9D6', borderWidth: 1, borderColor: '#505759'}}
            onPress={() => {
              if(this.state.selected == true) {
                this.props.screenProps.selectCharacter(this.props.character)
              } else {
                this.setState({selected: true})
              }
            }
          }
          >
             <View style={{ flex: 1}} > 
              <Text style ={{marginLeft: 5, fontFamily: 'Alternate Gothic No1 D', marginTop: 4, textAlign: 'center', color: '#505759'}}>
                {this.state.selected == true ? 'CONFIRM' : 'PICK THIS ONE'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Image
          style={{height: 130, width: 142,  resizeMode: "contain"}}
          source={this.props.source}
          resizeMethod={"resize"}
        />
      </View>
    )
  }
}




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
