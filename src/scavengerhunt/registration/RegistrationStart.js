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

import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { NavigationActions } from 'react-navigation';






const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

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
      position: ''
    }
  }


  // async componentDidMount() {
  //   if (Platform.OS === 'ios') {
  //     this.locationFunction()
  //   } else {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           'title': 'Scavenger Hunts Need Location Permision',
  //           'message': 'Please enable location so we you can do a scavenger hunt'
  //         }
  //       )
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         this.locationFunction()
  //       } else {
  //         console.log("Camera permission denied")
  //       }
  //     } catch (err) {
  //       console.warn(err)
  //     }
  //   }    
  // }

  // componentWillUnmount() {
  //   navigator.geolocation.clearWatch(this.watchId);
  // }

  // locationFunction() {
  //   this.watchId = navigator.geolocation.watchPosition(
  //     (position) => {
  //       this.setState({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         error: null,
  //       });
  //       let region = {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         latitudeDelta: 40,
  //         longitudeDelta: 60
  //       };
  //       global.region = region;
  //       Alert.alert('We know your current position is: '+position.coords.latitude+','+position.coords.longitude);
  //     },
  //     (error) => this.setState({ error: error.message }),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
  //   );
  // }

  // handle question mark button click
  handleQuestionMarkPress = () => {
    this.setState({ showBarHuntInfoModal: true });
  }

  render() {
    let { goBack, navigate } = this.props.navigation;
    let { width, height } = Dimensions.get("window");


    return (
      <Container style={{ flex: 1, backgroundColor: '#D9D9D6' }}>
        <LetsRoamHeader
          handleDrawerPress={this.props.screenProps.handleDrawerPress}
        />
        <Image
          style={{ resizeMode: "cover", height: height - 55, width: width }}
          source={require("../../images/registrationStartImage.png")}
        />
        <View style={{ backgroundColor: 'rgba(232, 119, 34, .5)', position: 'absolute', height: height - 55, width: width, top: 55, left: 0 }}>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: '#6AAEAA', position: 'absolute', height: 64, bottom: 175, left: 52, right: 52 }}
          onPress={() => { this.props.navigation.navigate('RegistrationHuntList') }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 34, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center' }}> START NEW HUNT </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#FFC600', position: 'absolute', height: 64, bottom: 101, left: 52, right: 52 }}
          onPress={() => { Alert.alert('This feature is still under development') }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 34, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center' }}> JOIN A HUNT</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: 'rgba(0,0,0,0)', position: 'absolute', height: 64, bottom: 28, left: 52, right: 52, borderWidth: 2, borderColor: 'white' }}
          onPress={() => { console.log('Top Button Pressed') }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 34, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center' }}> FIND HUNT LOCATIONS </Text>
          </View>
        </TouchableOpacity>

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