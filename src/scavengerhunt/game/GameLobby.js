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
              headerTitle={'Game Lobby'}
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
            {groupInfo.theme + ' Hunt'}
          </Text>
        </View>
      </View> 
      <View style={{position: 'absolute', backgroundColor: 'rgba(217,217,214,1)', top: 70+35-20+100, height: 20, left: 0, right: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}} >
        <Text style={{color: '#505759', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center'}}>
            {'Starts At: '+ groupInfo.startingLocation != null ? groupInfo.startingLocation.replace(/\d{5},\sU[^>]+/ig,'').replace(/\sUSA/,'').replace(/\sUnited\sStates/,'').replace(/[,;]$/,'').replace(/\s+$/,'') : ''}
        </Text>
      </View> 
      <ScrollView style={{position: 'absolute', top: 70+35-20+100+20, bottom: 80, left: 20, right: 20}} >
          <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No1 D', fontSize: 31, marginLeft: 5, marginTop: 10, textAlign: 'center'}}>
            {('Lobby for ' + groupInfo.teamName).toUpperCase()}
          </Text>
          <View style={{width: width-40, height: 3,backgroundColor: '#505759'}} />
          <View style={{flexDirection: 'row', width: width-40, flexWrap:"wrap", justifyContent: 'center', marginTop: 10}} >
          {Object.values(groupInfo.players).map((player) => {
            return (
              <User
              userPhoto={player.photoUrl}
              userName={player.firstName}
            />
            )
          })}
          </View>
          
      </ScrollView>
      <View style={{backgroundColor: 'rgba(217,217,214,1)', height: 20, alignContent: 'center', justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', bottom: 80, left: 0, right: 0}} >
            <Text style={{color: '#505759', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center'}}>
              {'JOIN CODE: ' + groupInfo.groupId.substring(0,5).toUpperCase()}
            </Text>
            
          </View>
      <View style={{position: 'absolute', flexDirection: 'row', height: 80, bottom: 0, left: 0, right: 0}}>
        <TouchableOpacity
          style = {{width: (width-80)/2, height: 80, backgroundColor: '#6AAEAA', alignContent: 'center', alignItems: 'center', justifyContent: 'center', justifyItems: 'center'}}
        >
          <Text style={{fontFamily: 'Alternate Gothic No3 D', color: 'white', fontSize: 25, textAlign: 'center'}}> INVITE </Text>
          <Text style={{fontFamily: 'Alternate Gothic No3 D', color: 'white', fontSize: 25, textAlign: 'center'}}> PLAYERS </Text>
        </TouchableOpacity>
        <View
          style = {{width: 80, height: 80, backgroundColor: 'black', flexDirection: 'column', justifyContent: 'flex-start', justifyItems: 'flex-start'}}
        > 
          <QRCode
            value={groupInfo.groupId.substring(0,5).toUpperCase()}
            size={80}
            bgColor='#505759'
            fgColor='white'/>
        </View>
        <TouchableOpacity
          style = {{width: (width-80)/2, height: 80, backgroundColor: '#E87722', alignContent: 'center', alignItems: 'center', justifyContent: 'center', justifyItems: 'center'}}
          onPress={() => this.props.screenProps.makeHuntLive(groupInfo.groupId)}
        >
          <Text style={{fontFamily: 'Alternate Gothic No3 D', color: 'white', fontSize: 25, textAlign: 'center'}}> START </Text>
          <Text style={{fontFamily: 'Alternate Gothic No3 D', color: 'white', fontSize: 25, textAlign: 'center'}}> HUNT </Text>
        </TouchableOpacity>
      </View>
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

class User extends Component {
  render() {
    console.log('the photo url is', this.props.userPhoto)
    return (
      <View style={{width: 70, height: 80, alignItems: 'center', alignContent: 'center', marginBottom: 5, marginLeft: 10, margingRight: 10}} >
        <Image
          source={{uri: this.props.userPhoto}}
          style={{height: 60, width: 60, borderRadius: 30 }}
        />
        <Text style={{ textAlign: 'center'}}>
          {this.props.userName}
        </Text>
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
