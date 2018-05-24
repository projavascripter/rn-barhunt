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
  PermissionsAndroid
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
import Switch from '../../common/Switch';

import { connect } from 'react-redux';


import axios from 'axios';
import geolib from 'geolib';

import Map from '../../common/Map';

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

class List extends Component {

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
      position: '',

      show: "LIST",
    }
  }


  // handle question mark button click
  handleQuestionMarkPress = () => {
    this.setState({ showBarHuntInfoModal: true });
  }

  render() {
    let { goBack, navigate } = this.props.navigation;
    let { width, height } = Dimensions.get("window");


    let hunt_ordered = this.props.hunts.items;
    console.log('the current location redux state')
    console.log(this.props.location)
    if (this.props.location.region != null) {
      hunt_ordered = hunt_ordered.slice().sort((a, b) => {
        let aRank = Math.pow(Math.pow(a.lat - this.props.location.region.latitude, 2) + Math.pow(a.long - this.props.location.region.longitude, 2), 0.5);
        let bRank = Math.pow(Math.pow(b.lat - this.props.location.region.latitude, 2) + Math.pow(b.long - this.props.location.region.longitude, 2), 0.5);
        return aRank < bRank ? -1 : 1
      });
    }

    console.log('The Registration Home Page is being Reloaded')
    // bg was D9D9D6
    return (
      <Container style={{ flex: 1, backgroundColor: 'white' }}>
        <LetsRoamHeader
          handleDrawerPress={this.props.screenProps.handleDrawerPress}
        />
        <PageHeader
          headerTitle={'1. Pick your Scavenger Hunt!'}
          backgroundColor={'#53A6C4'}
          backAction={() => this.props.navigation.goBack()}
        />

        {/* <Switch
          textArr={["LIST", "MAP"]}
          textSelected={this.state.show}
          buttonHandlers={[
            () => { this.setState({ show: "LIST" }) },
            () => { this.setState({ show: "MAP" }) },
          ]}
        /> */}

        {this.state.show == "LIST" &&
          <View style={{ backgroundColor: 'white', position: 'absolute', height: height - 69 - 35 - 45, width: width, top: 70 + 35 + 45, left: 0 }}>
            <FlatList
              style={{ marginTop: 30 }}
              data={hunt_ordered}
              keyExtractor={(item, index) => String(item.name)}
              renderItem={({ item, index }) => {
                if (item.hunt_id == null) {
                  console.log('item.name')
                }
                //global.region != null ? Math.pow(Math.pow(item.lat-global.region.latitude, 2)+Math.pow(item.long-global.region.longitude, 2),0.5): ''
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('RegistrationHuntInfo', { selectedHunt: item })
                    }}
                  >

                    <View style={{ backgroundColor: 'rgba(0,0,0,0)', marginLeft: 20, marginRight: 20, height: 150, marginBottom: 20, flexDirection: 'row' }} >
                      <View style={{ position: 'absolute', top: 0, height: 130, left: 0, right: 0 }} >
                        <Image source={{ uri: item.huntLargePhotoURL }}
                          style={{ flex: 1, height: 130 }} />
                      </View>
                      <View style={{ position: 'absolute', backgroundColor: 'rgba(80,87,89,0.5)', top: 0, height: 130, left: 0, right: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 18, textAlign: 'center' }}>
                          {item.city + ' Scavenger Hunt'}
                        </Text>
                        <Text style={{ color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 40, textAlign: 'center' }}>
                          {item.name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                          <View style={{ height: 5, width: 60 }} />
                          <Text style={{ color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 18, marginRight: 10 }}>
                            {Math.max(item.total_reviews, 10) + ' Reviews'}
                          </Text>
                          <StarRatingBar
                            score={Math.max(item.star_rating, 4)}
                            continuous={true}
                            allowsHalfStars={true}
                            accurateHalfStars={true}
                            scoreTextStyle={{ color: 'rgba(0,0,0,0)' }}
                          />
                        </View>
                      </View>
                      <View style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(217,217,214,1)',
                        top: 130, height: 20, left: 0, right: 0,
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }} >
                        <Text style={{
                          color: '#505759',
                          fontFamily: 'CircularStd-Book',
                          fontSize: 12,
                          textAlign: 'center'
                        }}>
                          {'Starts At: ' + item.starting_location.replace(/\d{5},\sU[^>]+/ig, '').replace(/\sUSA/, '').replace(/\sUnited\sStates/, '').replace(/[,;]$/, '').replace(/\s+$/, '')}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                )
              }}
            />
          </View>
        }

        {/* {this.state.show == "MAP" &&
          <Map
            lon="41.2724386"
            lat="-71.025684"
          
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              height: height - 69 - 35 - 45,
              width: width,
              top: 70 + 35 + 45,
              left: 0
            }} />
        } */}

      </Container>
    );
  }
};

const mapStateToProps = (state) => {
  const { hunts, location } = state;
  return { hunts, location };
}

const actions = {};

List = connect(mapStateToProps, actions)(List);

export default List;

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

// import React, { Component } from 'react';
// import {
//   Text,
//   View,
//   Platform, Alert, Image, Linking, ScrollView, TouchableOpacity, Dimensions, AsyncStorage
// } from 'react-native';
// import { Card, CardSection, Button } from '../../common/';

// class RegistrationHome extends Component {

//   state = {
//   mapRegion: null,
//   lastLat: null,
//   lastLong: null,
//   locations: [],
//   mapPositionUpdatedOnce: false,
//   selectedMarker: '',
//   previousHuntAuthCode: ''
// }

//   componentDidMount() {
//     AsyncStorage.getItem('auth_code')
//     .then((value) => this.setState({ 'previousHuntAuthCode': value }))
//   }

//   previousHuntDetected() {
//     if (this.state.previousHuntAuthCode !== '' && this.state.previousHuntAuthCode !== null) {
//       return (
//         <TouchableOpacity onPress={() => { Alert.alert(this.state.previousHuntAuthCode); global.auth_code = this.state.previousHuntAuthCode }} style={styles.buttonGreenStyle}>
//           <Text style={styles.buttonGreenTextStyle}>
//             Continue Previous Hunt?
//           </Text>
//         </TouchableOpacity>
//       );
//     }
//   }

//   render() {
//     const { width, height } = Dimensions.get('window');
//     return (
//         <View key={this.state.previousHuntAuthCode}>
//           <View style={{ width: this.width, backgroundColor: '#2E4B66', alignItems: 'center' }}>
//             <Image
//               style={{ marginTop: 20, height: 120, width: 250 }}
//               source={require('../../common/logo.png')}
//             />
//             <Text style={{ marginTop: 5, textAlign: 'center', color: '#98cb51', fontSize: 22, fontWeight: '600' }}> Your Adventure Awaits </Text>
//             <Text style={{ textAlign: 'center', color: '#FFFFFF', fontSize: 12, fontWeight: '400', marginBottom: 20 }}> Find your starting location and start your adventure </Text>
//           </View>
//           <View style={{ height: 300, width: this.width }}>
//                 {this.previousHuntDetected()}
//                 <TouchableOpacity onPress={() => { this.props.navigation.navigate('RegistrationGroupType'); }} style={styles.buttonGreenStyle}>
//                   <Text style={styles.buttonGreenTextStyle}>
//                     Start your Hunt*
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={console.log('button')} style={styles.buttonWhiteStyle}>
//                   <Text style={styles.buttonWhiteTextStyle}>
//                     Purchase Hunt
//                   </Text>
//                 </TouchableOpacity>
//                 <Text style={{ marginLeft: 10, marginRight: 10, textAlign: 'center' }}> *Only the team leader needs to register with the app. All other roles get challenges by text. </Text>
//           </View>
//         </View>
//       );
//     }
//   }

// export default RegistrationHome;

styles = {
  buttonGreenStyle: {
    height: 50,
    width: this.width,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#E87722',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10
  },
  buttonGreenTextStyle: {
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'Alternate Gothic No3 D',
    letterSpacing: 4,
  },
  buttonWhiteStyle: {
    height: 50,
    width: this.width,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#6AAEAA',
    borderColor: '#CCC',
    borderWidth: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10
  },
  buttonWhiteTextStyle: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 21,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'Alternate Gothic No3 D',
    letterSpacing: 4,
  },
  container: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 0,
      },
      android: {
        top: 0,
      },
    }),
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  TextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  TitleStyle: {
    fontSize: 18
  },
  ThumbnailStyle: {
    height: 50,
    width: 50
  },
  ArtworkStyle: {
    height: 250,
    flex: 1,
    width: null,
  },
  headerViewStyle: {
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    height: 50,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    elevation: 2,
    position: 'relative',
    flexDirection: 'row'
  },
  headerTextStyle: {
    fontSize: 20
  },
  ThumbNailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },

  statusBarBackground: {
    marginTop: (Platform.OS === 'ios') ? 20 : 0, //this is just to test if the platform is iOS to give it a height of 20, else, no height (Android apps have their own status bar)
    color: '#464D4F'
  },
  modalStatusBarBackground: {
    top: (Platform.OS === 'ios') ? 20 : 0, //this is just to test if the platform is iOS to give it a height of 20, else, no height (Android apps have their own status bar)
    color: '#464D4F'
  }
}