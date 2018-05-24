/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage,
  Button
} from 'react-native';
import styled from 'styled-components';
let {width, height} = Dimensions.get("window");
import {getDatabase} from '..//utils/db'
import google from '../utils/google';
import {facebookLogout} from "../utils/facebook";
let {getGoogleSignin, isGoogleSessionExists} = google;
import fireUtil from '../utils/fireUtils';
let {getUserInfo} = fireUtil;
import Icon from 'react-native-vector-icons/FontAwesome';

const Container = styled.View`
  background-color: #f2f2f2;
  flex: 1;
  padding: 15px;
`;

const PictureContainer = styled.View`
  width: 150px;
  height: 150px;
  margin-right: 15px;

`;

const InfoContainer = styled.View`
`;

const Row = styled.View`
  flex-direction: row;
  flex-grow: 2;
`;

const LogoutButtonText = styled.Text`
  text-align: center;
`;

const BackButton = styled.TouchableOpacity`
  padding-left: 15px;
`;

export default class extends Component {

  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};

    return {
      title: "Profile",
      headerLeft: (
        <BackButton onPress={() => {
          navigation.state.params.onBack();
          navigation.goBack();
        }}>
          <Icon name="chevron-left" size={30} color="#000" />
        </BackButton>
      ),
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      userInfo: {}
    };

  }

  componentDidMount() {
    this.setupDbListener();
  }

  setupDbListener = async () => {

    // get userId from AsyncStorage
    let userId = await AsyncStorage.getItem("userId");

    let userInfo = await getUserInfo(userId);
    this.setState({userInfo});

  }

  handleLogout = async () => {
    // this.dbRef.off(); //remove db listener
    let {navigate, replace} = this.props.navigation;

    // logout
    let google = await getGoogleSignin();
    let googleSessionExists = await isGoogleSessionExists();
    if (googleSessionExists) {
      await google.signOut();
    }

    // facebook can log out directly
    facebookLogout();

    // delete the userId in the AsyncStorage
    await AsyncStorage.removeItem("userId");

    // after deleting session, go to login screen
    this.props.navigation.state.params.onBack();
    this.props.navigation.goBack();

  };

  render() {
    return (
      <Container>
        <Row>
          <PictureContainer>
            <Image
              style={{width: 150, height: 150, borderRadius: 75}}
              source={{uri: this.state.userInfo.photoUrl}}
            />
          </PictureContainer>
          <InfoContainer style={{width: width - 15 * 3 - 150}}>
            <Text>{this.state.userInfo.firstName} {this.state.userInfo.lastName}</Text>
            <Text>{this.state.userInfo.email}</Text>
          </InfoContainer>
        </Row>
        <TouchableOpacity onPress={this.handleLogout}>
          <LogoutButtonText>Log out</LogoutButtonText>
        </TouchableOpacity>
      </Container>
    );
  }
}