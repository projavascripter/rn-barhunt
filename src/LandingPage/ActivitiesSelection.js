import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Linking,
  SafeAreaView
} from 'react-native';


import styled from 'styled-components';
import MyText from 'react-native-letter-spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
let logo = require("../images/logo.png");
let logo3 = require("../images/logo3.png");
let logo4 = require("../images/logo4.png");

let { width, height } = Dimensions.get("window");
import Carousel from 'react-native-snap-carousel';
import Color from 'color'

import LetsRoamHeader from '../modules/LetsRoamHeader'
import PageHeader from '../modules/PageHeader'


export default class MyCarousel extends Component {

  static navigationOptions = {
    title: "Let's Roam Home",
    header: null
  };

  componentDidMount() {

    // for testing
    this.props.navigation.navigate('ScavengerHunt')
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#A7A8AA', flex: 1 }}>
        <Container style={{ flex: 1, backgroundColor: '#A7A8AA' }}>
          <LetsRoamHeader
            handleDrawerPress={this.props.screenProps.handleDrawerPress}
          />
          <PageHeader
            headerTitle={'Choose an activity'}
            backgroundColor={'#53A6C4'}
            backAction={() => this.props.navigation.navigate('LandingPage')}
          />
          <Section
            backgroundColor={'rgb(232, 119, 34)'}
            source={require("../images/activitiesScavengerHuntBackground.png")}
            headerText={'Scavenger Hunts'}
            bodyText={"Explore any of our 300+ cities on a two-hour walking scavenger hunt tour and adventure! Turn any location into your personal playground by answering trivia questions and solving challenges through a fun and interactive app!"}
            buttonOnPress={[
              () => { this.props.navigation.navigate('ScavengerHunt') },
              () => {
                this.props.navigation.navigate('ScavengerHunt')
              }]}
          />
          <Section
            backgroundColor={'rgb(255, 198, 0)'}
            source={require("../images/activitiesTeamBuildingBackground.png")}
            headerText={'Team Building'}
            bodyText={"Improve your team communication and build great working relationships through our interactive team building activities. Get to know your team and your city with our team building scavenger hunts!"}
            buttonOnPress={[
              () => { this.props.navigation.navigate('ScavengerHunt') },
              () => {
                Linking.openURL('https://www.scavengerhunt.com/corporate_team_building.html?utm_source=app')
              }]}
          />
          <Section
            backgroundColor={'rgb(106, 174, 170)'}
            source={require("../images/activitiesBarHuntBackground.png")}
            headerText={'Bar Hunt (Denver Only Beta)'}
            bodyText={"Explore the nightlife in a new or familiar place with our bar crawl scavenger hunt! Explore the most popular bars, play games and compete with others along the way. So grab your friends or a solo ticket and join a Let’s Roam Bar Hunt!"}
            buttonOnPress={[
              () => { this.props.navigation.navigate('BarHuntHome') },
              () => {
                this.props.navigation.navigate('BarHuntHome')
              }]}
          />
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('DrawerToggle') }} style={{ position: 'absolute', top: 7, right: 12, backgroundColor: 'rgba(0,0,0,0)' }}>
            <Icon name="bars" size={30} color={Color('white').alpha(0.9)} />
          </TouchableOpacity>
        </Container>

      </SafeAreaView>
    );
  }
}

class Section extends Component {
  render() {
    return (
      <View style={{ width: width, height: (height - 65 - 35) / 3 }} >
        <Image
          style={{ resizeMode: 'cover', width: width, height: (height - 65 - 35) / 3, position: 'absolute', top: 0, left: 0 }}
          source={this.props.source}
        />
        <View
          style={{
            width: width, height: (height - 65 - 35) / 3, backgroundColor: Color(this.props.backgroundColor).alpha(0.7),
            padding: 10
          }} >
          <Text style={{ color: 'white', fontSize: 37, fontFamily: 'Alternate Gothic No1 D', textAlign: 'left' }}>
            {this.props.headerText.toUpperCase()}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'white', width: 100, height: 26, marginTop: 5,
              shadowColor: '#A7A8AA', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.6, shadowRadius: 2, elevation: 10
            }}
            onPress={this.props.buttonOnPress[0]}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ color: Color(this.props.backgroundColor), fontSize: 16, fontFamily: 'Alternate Gothic No1 D', textAlign: 'center' }}>
                {'PLAY'}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20 }}>
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Alternate Gothic No1 D', textAlign: 'center' }}>
              {this.props.bodyText}
            </Text>
          </View>
        </View>

      </View>
    );
  }
}

const Container = styled.View`
  background-color: #D9D9D6;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;

