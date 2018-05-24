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

import HTML from 'react-native-render-html';

import axios from 'axios';
import geolib from 'geolib';





const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default class List extends Component {

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
        position: ''
    }
  }

  // handle question mark button click
  handleQuestionMarkPress = () => {
    this.setState({ showBarHuntInfoModal: true });
  }
  
  render() {
    let { goBack, navigate } = this.props.navigation;
    let { width, height } = Dimensions.get("window");
    let selectedHunt = this.props.navigation.state.params.selectedHunt
    console.log('The Registration Home Page is being Reloaded')
    console.log('The long description is')
    console.log(selectedHunt.long_description.replace(/<br>/ig, '').replace(/&nbsp;/ig,'').replace(/<p><\/p>/ig,'').replace(/<p[^>]*>[\s|&nbsp;]*<\/p>/,''))
    return (
    <Container style={{flex: 1, backgroundColor: 'white'}}>
       <LetsRoamHeader  
        handleDrawerPress={this.props.screenProps.handleDrawerPress}
      />
      <PageHeader  
              headerTitle={'2. Confirm your choice'}
              backgroundColor={'#53A6C4'}
              backAction={() => this.props.navigation.goBack()}
      /> 
      <View style={{position: 'absolute', top: 70+35-20, height: 130, left: 0, right: 0}} >
        <Image source={{uri: selectedHunt.huntLargePhotoURL}}
        style={{flex: 1, height: 130}} />
      </View> 
      <View style={{position: 'absolute', backgroundColor: 'rgba(80,87,89,0.5)', top: 70+35-20, height: 130, left: 0, right: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}} >
        <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 18, textAlign: 'center'}}>
          {selectedHunt.city + ' Scavenger Hunt'}
        </Text>
        <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 40, textAlign: 'center'}}>
          {selectedHunt.name}
        </Text>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
          <View style = {{height: 5, width: 60}} />
          <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 18, marginRight: 10}}>
            {Math.max(selectedHunt.total_reviews,10) + ' Reviews'}
          </Text>
          <StarRatingBar
                      score={Math.max(selectedHunt.star_rating,4)}
                      continuous={true}
                      allowsHalfStars={true}
                      accurateHalfStars={true}
                      scoreTextStyle={{color: 'rgba(0,0,0,0)'}}
          />
        </View>
      </View> 
      <View style={{position: 'absolute', backgroundColor: 'rgba(217,217,214,1)', top: 70+35-20+130, height: 20, left: 0, right: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}} >
        <Text style={{color: '#505759', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center'}}>
            {'Starts At: '+ selectedHunt.starting_location.replace(/\d{5},\sU[^>]+/ig,'').replace(/\sUSA/,'').replace(/\sUnited\sStates/,'').replace(/[,;]$/,'').replace(/\s+$/,'')}
        </Text>
      </View> 
      <ScrollView style={{position: 'absolute', backgroundColor: 'white', top: 70+35-20+130+20, bottom: 0, left: 20, right: 20}} >
        <View style={{flex: 1}}>
        <TouchableOpacity 
            style = {{backgroundColor: '#E87722', height: 50, width: width-60, marginTop: 10, marginLeft: 10}} 
            //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
            onPress={() => {  this.props.navigation.navigate('RegistrationThemeSelection', { selectedHunt: selectedHunt }) }}
          >
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: 'white', fontSize: 25, marginLeft: 15, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}> START THIS HUNT</Text>
            </View>
          </TouchableOpacity>
        <View style={{width: width-20, marginLeft: 15, height: 3, backgroundColor: '#A7A8AA', marginTop: 10}} />
          <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 21, marginTop: 14, marginBottom: 10, textDecorationLine: 'underline'}}>
            {('About this '+selectedHunt.city+ ' Scavenger Hunt').toUpperCase()}
          </Text>
          <HTML 
            style={{}}
            baseFontStyle = {{ textAlign: 'left', fontFamily: 'CircularStd-Book', fontSize: 12, color: '#505759'  }}
            html={selectedHunt.long_description.replace(/<br>/ig, '').replace(/&nbsp;/ig,'').replace(/<p><\/p>/ig,'').replace(/<p[^>]*>[\s|&nbsp;]*<\/p>/,'').replace(/<p[^>]+>/,'<p>')
          } 
                  //tagsStyles= {{ p: { textAlign: 'center', fontStyle: 'CircularStd-Black', fontSize: 20, color: 'black' } }}
          />
          <TouchableOpacity 
            style = {{backgroundColor: '#FFC600', height: 50, width: width-60, marginTop: 10, marginLeft: 10}} 
            //onPress={() => {  this.props.navigation.navigate('OldLandingPage') }}
            onPress={() => {  this.props.navigation.navigate('ActivitiesSelection') }}
          >
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: 'white', fontSize: 25, marginLeft: 15, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}> GET DIRECTIONS</Text>
            </View>
          </TouchableOpacity>
          <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 21, marginTop: 14, marginBottom: 10, textDecorationLine: 'underline'}}>
            {('Top Photos from this hunt').toUpperCase()}
          </Text>

        </View>
      </ScrollView> 
      {/* <View style = {{backgroundColor: 'rgba(217, 217, 214, 1)', position: 'absolute', height: height - 66-35, width: width, top: 67+35, left: 0}}>
        <FlatList
          style={{ marginTop: 30 }}
          data={this.state.locations}
          keyExtractor={(item, index) => String(item.name)}
          renderItem={({ item, index }) => {
            if(item.hunt_id == null){
              console.log('item.name')
            }
            //global.region != null ? Math.pow(Math.pow(item.lat-global.region.latitude, 2)+Math.pow(item.long-global.region.longitude, 2),0.5): ''
            return (
              <TouchableOpacity
                onPress={()=> {
                  this.props.navigation.navigate('RegistrationHuntInfo', { selectedHunt: item })
                }}
              >
                
                <View style={{backgroundColor: 'rgba(0,0,0,0)', marginLeft: 20, marginRight: 20, height: 150, marginBottom: 20, flexDirection: 'row'}} >
                  <View style={{position: 'absolute', top: 0, bottom: 20, left: 5, right: 0}} >
                    <Text style = {{color: 'white', fontSize: 38, marginLeft: 5, marginTop: 5, fontFamily: 'Alternate Gothic No1 D'}}>{item.name}</Text>
                    <StarRatingBar
                      score={Math.max(item.star_rating,4)}
                      continuous={true}
                      allowsHalfStars={true}
                      accurateHalfStars={true}
                      scoreTextStyle={{color: 'rgba(0,0,0,0)'}}
                  />
                  <Text style = {{color: 'white', fontSize: 25, marginLeft: 5, marginTop: 5, fontFamily: 'Alternate Gothic No1 D'}}>{Math.max(item.star_rating,4)+ ' Star Rating'}</Text>
                  <Text style = {{color: 'white', fontSize: 25, marginLeft: 5, marginTop: 5, fontFamily: 'Alternate Gothic No1 D'}}>{Math.max(item.star_rating,10) + ' Reviews'}</Text>
                  </View>
                  <View style={{position: 'absolute', top: 130, bottom: 0, left: 0, right: 0}} >
                    <Text style = {{color: '#505759', fontSize: 12, fontFamily: 'CircularStd-Bold'}}>{'Starts At: '+ item.starting_location.replace(/\d{5},\sUSA/ig,'')}</Text>
                  </View>
                </View>
              </TouchableOpacity>
                      
            )
          }}
        />
      </View> */}

      
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


// let selectedHunt = this.props.navigation.state.params.selectedHunt
// //<ScrollView style={{ flex: 1 }}>
// return (
//     <Card>
//     <View style={{width: width, height: height - 200}}>
//       <LetsRoamHeader  
//         handleDrawerPress={this.props.screenProps.handleDrawerPress}
//       />
//       <ScrollView style={{ flex: 1 }}>
//         <CardSection>
//           <Image
//             source={{ uri: selectedHunt.huntLargePhotoURL }}
//             style={styles.ArtworkStyle}
//           />
//         </CardSection>
//         <CardSection>
//           <HTML
//             html={selectedHunt.long_description}
//           />
//         </CardSection>
//       </ScrollView>
//     </View>
//     <View style={{width: width-10, height: 100}}>
//       <CardSection>
//         <Button onPress= {() => { this.props.navigation.navigate('RegistrationWeb', { selectedHunt: selectedHunt.hunt_id }); }} >
//           Play Now
//         </Button>
//         <Button onPress={() => Linking.openURL('https://www.scavengerhunt.com/store/')} >
//           Buy Now
//         </Button>
//         <Button onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query='.concat((selectedHunt.starting_location).replace(' ', '+')))} >
//           Directions
//         </Button>
//       </CardSection>
//     </View>
//     </Card>