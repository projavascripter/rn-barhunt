

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
  ScrollView,
  FlatList
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

import {List, ListItem} from 'react-native-elements'

import bluebg from '../../images/rank/bluebg.png';
import greybg from '../../images/rank/greybg.png';
import orangebg from '../../images/rank/orangebg.png';
import yellowbg from '../../images/rank/yellowbg.png';

import helpers from '../../utils/helpers';
let {getOpaqueColorWithChallengeType, getColorWithChallengeType} = helpers;

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
    let { playerRank, photoUrl, firstName, lastName, challengeBarId} = item;
    let fullName = `${firstName} ${lastName}`;
    if (playerRank == 0) {
      bg = '#FFC600';
      rankText = "1st"; 
    } else if (playerRank == 1) {
      bg = '#D9D9D6';
      rankText = "2nd";
    } else if (playerRank == 2) {
      bg = '#E87722';
      rankText = "3rd";
    } else {
      bg = '#6AAEAA';
      rankText = `${playerRank + 1}th`;
    }
    console.log('The player completion data for the selected player is ')
    console.log()
    
    

    return (
      <Modal isVisible={this.props.show} transparent={true}  style={{ margin: 0, backgroundColor:"#FFFFFF"}}>
        <View style={{ position: 'absolute', width: width, height: 200, top: ((Device.isIphoneX ? 44 : 0) + (Platform.OS === 'ios') ? 20 : 0), left: 0, backgroundColor: bg }}>
            <BackButton
              onPress={this.props.handleClose}
            />
            <Image
              style={{
              width: 65, 
              height: 65, 
              borderRadius: 32.5, 
              borderWidth: 2, 
              borderColor: "black",
              top: 10,
              left: width/2-32.5,
              position: "absolute",
              bottom: 1,
              right: 0,
              zIndex: 3
              }}
              source={{ uri: photoUrl }}
              />
              <PlayerNameText> {fullName} </PlayerNameText>
              <PlayerRankText> {rankText} </PlayerRankText>
            {/* <BarTitle
              numberOfLines={1}
              style={{fontSize: fontSize}}
              
            >{barName != null ? barName.toUpperCase(): barName}
          </BarTitle>
          <BarTimeText style={{color: '#E87722', fontSize: 25}} >{barTimes}</BarTimeText> */}
        </View>
        <View style = {{ position: 'absolute', backgroundColor: '#D9D9D6', width: width, height: height-200, top: ((Device.isIphoneX ? 44 : 0) + (Platform.OS === 'ios') ? 200 : 200), left: 0 }}>
            <HeaderText style={{ marginTop: 10 }}>
                    {'Completed Challenges'}
            </HeaderText>
            <List containerStyle={{ flex: 1, backgroundColor: 'white', height: 2000  }}>
            <FlatList 
              key={item.completedChallenges}
              data={item.completedChallenges}
              renderItem={({ item }) => (
                <ListItem
                  //roundAvatar, , completorPhotoUrl
                  roundAvatar
                  avatar={{uri:  `https://www.scavengerhunt.com/barHuntImages/${item.challengeBarImage}.jpg` }}
                  containerStyle={{ backgroundColor:  'white' }}
                  rightIcon={
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontSize: 28, marginRight: 3, marginBottom: 3, color: '#E87722'}}>{item.points}</Text>
                      <Image
                        style={{ height: 26, width: 20 }}
                        source={require('../../images/orange_fox.png')}
                      />
                    </View>
                  }
                  //containerStyle={{ borderBottomColor:  getColorWithChallengeType(item.challengeType) }}
                  underlayColor={'black'}
                  title={item.challengeTitle}
                  subtitle={item.challengeText}
                  titleStyle ={{color:'#505759', fontFamily: 'CircularStd-Black'}}
                  subtitleStyle ={{color: '#505759', fontFamily: 'CircularStd-Black'}}
                  subtitleNumberOfLines={0}
                />
              )}
            />
        </List>
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
  font-family: 'Circular Std Black';
`;

const PlayerNameText = styled.Text`
  color: #FFFFFF;
  position: absolute;
  font-size: 30;
  font-weight: 600;
  top: 85;
  height: 40;
  left: 5;
  right: 5;
  text-align: center;
  font-family: 'Alternate Gothic No3 D';
`;
const PlayerRankText = styled.Text`
  color: #FFFFFF;
  position: absolute;
  font-size: 30;
  font-weight: 600;
  top: 130;
  height: 40;
  left: 5;
  right: 5;
  text-align: center;
  font-family: 'Alternate Gothic No3 D';
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