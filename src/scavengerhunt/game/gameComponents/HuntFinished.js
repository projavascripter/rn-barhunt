import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  TextInput,
  Linking
} from 'react-native';
import styled from 'styled-components';
import HTML from 'react-native-render-html';
import Svg, {Polygon} from 'react-native-svg'
import Dash from 'react-native-dash';

import { getDatabase } from "../../../utils/db";
import fireUtil from '../../../utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;

import Map from '../../../common/Map';

var SeededShuffle = require('seededshuffle');

import StarRating from 'react-native-star-rating';

import axios from 'axios'

import uuid from 'uuid/v4'

import RatingRequestor from 'react-native-rating-requestor';
let RatingTracker = new RatingRequestor('com.barhuntv2');

export default class TreasureChallenges extends Component {
    constructor() {
        super();
    
        this.state = {
          //state needs to be updated when the current question changes and when the completion data changes
          //it should be handled in the exact same manner
          placeholder: null,
          highestCompletion: 0,
          huntRating: null,
          characterRating: null,
          appRating: null,
          page: 1,
          googleReview: false,
          facebookReview: false
        }
      }
    
    render() {
      width=this.props.width
      let reviewsObject = this.props.screenProps.groupInfo.players[this.props.screenProps.user.info.userId].reviews
      console.log('the review object is',  )

      if (reviewsObject != null && reviewsObject.bonusReviewDone != null  && reviewsObject.r_hunt + reviewsObject.r_app >= 8) {
        RatingTracker.handlePositiveEvent();
      }

      return (
        <View style={{flex: 1}} >
          {reviewsObject == null &&
            <View style={{
              flex: 1,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              alignItems: "center",
              borderRadius: 5
    
            }}>
              <Text style={{color: '#505759', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center', marginBottom: 10}}>
                  {'Let us know how we did before you your rank!'}
              </Text>
              <Title style={{color: '#505759'}} >{'How would you rank the this hunt?'.toUpperCase()}</Title>
              <StarRating
                containerStyle={{marginBottom: 20}}
                disabled={false}
                maxStars={5}
                rating={this.state.huntRating}
                selectedStar={(rating) => this.setState({huntRating: rating})}
                fullStarColor={'#FFC600'}
                emptyStarColor={'#A7A8AA'}
              />

              <Title style={{color: '#505759'}} >{'How would you rank the App?'.toUpperCase()}</Title>
              <StarRating
                containerStyle={{marginBottom: 20}}
                disabled={false}
                maxStars={5}
                rating={this.state.appRating}
                selectedStar={(rating) => this.setState({appRating: rating})}
                fullStarColor={'#FFC600'}
                emptyStarColor={'#A7A8AA'}
              />

              <Title style={{color: '#505759'}} >{'How would your character role?'}</Title>
              <StarRating
                containerStyle={{marginBottom: 20}}
                disabled={false}
                maxStars={5}
                rating={this.state.characterRating}
                selectedStar={(rating) => this.setState({characterRating: rating})}
                fullStarColor={'#FFC600'}
                emptyStarColor={'#A7A8AA'}
              />
            
              <TouchableOpacity
                style={{backgroundColor: '#E87722', height: 40, marginTop: 20, width: width-100, alignContent: 'center', justifyContent: 'center'}}
                onPress={() => this.submitPage1()}
              >
                <Text style={{color: 'white', fontSize: 20, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}>
                  {'See Bonuses and Score'.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          }
          {reviewsObject != null && reviewsObject.bonusReviewDone == null && (reviewsObject.r_hunt + reviewsObject.r_app > 8) &&
            <View style={{
              flex: 1,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              alignItems: "center",
              borderRadius: 5
    
            }}>
              <Title>Optional: Earn Bonus Points</Title>
              <Text style={{color: '#505759', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center', marginTop: 5, marginBottom: 20}}>
                  {'Tap any of the below to earn free tokens and points!'}
              </Text>
              <TouchableOpacity
                style={{width: width-100, height: (width-100)*(62/304), marginTop: 20, alignContent: 'center', justifyContent: 'center'}}
                onPress={() => {
                  if (this.state.facebookReview == false) {
                    Linking.openURL("https://www.facebook.com/pg/bigcityhunt/reviews/")
                    this.setState({facebookReview: true})
                  }
                }}
              >
                <Image source={this.state.facebookReview ? require('../../../images/facebookReviewThanks.png') : require('../../../images/facebookReview.png')}
                  style={{width: width-100, height: (width-100)*(62/304), resizeMode: 'stretch'}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{width: width-100, height: (width-100)*(62/304), marginTop: 20, alignContent: 'center', justifyContent: 'center'}}
                onPress={() => {
                  Linking.openURL("https://www.google.com/search?q=big+city+hunt#lrd=0x880e2ca5708fb057:0x2a96f0fce09c42c8,3,")
                  this.setState({googleReview: true})
                }}
              >
                <Image source={this.state.googleReview ? require('../../../images/googleReviewThanks.png') : require('../../../images/googleReview.png')}
                  style={{width: width-100, height: (width-100)*(62/304), resizeMode: 'stretch'}}
                />
              </TouchableOpacity>
            
              <TouchableOpacity
                style={{backgroundColor: '#E87722', height: 40, marginTop: 20, width: width-100, alignContent: 'center', justifyContent: 'center'}}
                onPress={() => this.submitPage2()}
              >
                <Text style={{color: 'white', fontSize: 20, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}>
                  {'See Bonuses and Score'.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          }
          {reviewsObject != null && (reviewsObject.bonusReviewDone != null || (reviewsObject.r_hunt + reviewsObject.r_app <= 8)) &&
            
            <View style={{
              flex: 1,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              alignItems: "center",
              borderRadius: 5
    
            }}>
              <Title>Optional: Earn Bonus Points</Title>
              <Text style={{color: '#505759', fontFamily: 'CircularStd-Book', fontSize: 12, textAlign: 'center', marginTop: 5, marginBottom: 20}}>
                  {'Tap any of the below to earn free tokens and points!'}
              </Text>
            
              <TouchableOpacity
                style={{backgroundColor: '#E87722', height: 60, marginTop: 20, width: width-100, alignContent: 'center', justifyContent: 'center'}}
                onPress={() => this.submitPage3()}
              >
                <Text style={{color: 'white', fontSize: 25, fontFamily: 'Alternate Gothic No3 D', textAlign: 'center'}}>
                  {'Exit Hunt'}
                </Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      )
    }

    submitPage1 = () => {
      if(this.state.huntRating == null) {
        Alert.alert('Please select a rating for your hunt and route.')
      }
      else if(this.state.appRating == null) {
        Alert.alert('Please select an app star rating.')
      }
      else if(this.state.characterRating == null) {
        Alert.alert('Please select a rating for your character and character challenges.')
      }
      else {
        
        let data = {
          user_id: this.props.screenProps.user.info.userId,
          auth_code: this.props.screenProps.groupInfo.groupId,
          hunt_id: this.props.screenProps.groupInfo.huntId,
          r_hunt: this.state.huntRating,
          r_app: this.state.appRating,
          r_role: this.state.characterRating,
          UUID: uuid()
        }
        this.props.screenProps.setUserReview(data)
        console.log('the axios data for the reviews is', data)
        this.setState({page: 2})
        axios.post('https://www.scavengerhunt.com/app/ios_ajax_post_user_review.php'
        +'?user_id='+data.user_id
        +'&auth_code='+data.auth_code
        +'&hunt_id='+data.hunt_id
        +'&r_hunt='+data.r_hunt
        +'&r_app='+data.r_app
        +'&r_role='+data.r_role
        +'&UUID='+data.UUID
        , data)
        .then((response) => {
          console.log(response);
        });
      }
    }

    submitPage2 = () => {
      let data = {
        user_id: this.props.screenProps.user.info.userId,
        auth_code: this.props.screenProps.groupInfo.groupId,
        hunt_id: this.props.screenProps.groupInfo.huntId,
        facebookReview: this.state.facebookReview,
        googleReview: this.state.googleReview,
        bonusReviewDone: this.state.googleReview
      }
      this.props.screenProps.setBonusReview(data)
    }

    submitPage3 = () => {
        this.props.screenProps.updateAuthCode(null)
    }

  
  } 

  styles = {
    huntOnButtonStyle: {
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
    huntOnButtonTextStyle: {
      alignSelf: 'center',
      color: '#FFFFFF',
      fontSize: 26,
      fontWeight: '400',
      paddingTop: 10,
      paddingBottom: 10,
      fontFamily: 'Alternate Gothic No3 D',
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
      marginLeft: 0,
      marginRight: 0,
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
  }
  

  const CenterText = styled.Text`
  text-align: center;
`;

const Container = styled.View`
  background-color: #A7A8AA;
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
  text-align: left;
  text-decoration-line: underline
  color: #E36B21;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const ThreeButtonGroup = styled.View`
  flex-direction: row;
  margin-top: 5px;
  height: 70px;
  justify-content: space-between;

`;