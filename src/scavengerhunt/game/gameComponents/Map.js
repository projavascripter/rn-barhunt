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
} from 'react-native';
import HTML from 'react-native-render-html';
import Svg, {Polygon} from 'react-native-svg'
import Dash from 'react-native-dash';

import { getDatabase } from "../../../utils/db";
import fireUtil from '../../../utils/fireUtils';
let { getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds } = fireUtil;

import Map from '../../../common/Map';

var SeededShuffle = require('seededshuffle');

export default class TreasureChallenges extends Component {
    constructor() {
        super();
    
        this.state = {
          //state needs to be updated when the current question changes and when the completion data changes
          //it should be handled in the exact same manner
          placeholder: null,
          highestCompletion: 5,
        }
      }
    
    render() {
      width=this.props.width
      return (
        <View
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0,0)'}}
        >
          {Platform.OS == "ios" &&
            <Map
            lat={this.props.coordinates[0]}
            lon={this.props.coordinates[1]}
          
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }} />
          }
          {Platform.OS == "android" &&
            <Map
            lat={this.props.coordinates[0]}
            lon={this.props.coordinates[1]}
          
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }} />
          }
          
            <TouchableOpacity
            onPress={() => this.props.showLocationChallenges()}
            style={{
              position: 'absolute',
              flexDirection: 'row',
              alignItems: 'center',
              right: 10,
              bottom: 10,
              width: 300,
              justifyContent: 'flex-end'
            }}
            >
              <Text style={{color: '#E87722', fontFamily: 'Alternate Gothic No3 D', fontSize: 25, marginRight: 5, fontWeight: '900'}}>
                BACK TO HUNT
              </Text>
              <Image
                source={require('../../../images/mapCancel.png')}
                style={{
                  height: 50,
                  width: 50
                }}
              />
          </TouchableOpacity>

          
        </View>
      )
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
  
