import React, { Component } from 'react';
import {
  Text,
  View,
  Platform, Alert, Image, Linking, ScrollView, TouchableOpacity, Dimensions,
  SafeAreaView
} from 'react-native';
import { Card, CardSection, Button } from '../../common/';
import styled from 'styled-components';

class RegistrationGroupType extends Component {

  state = {
  mapRegion: null,
  lastLat: null,
  lastLong: null,
  locations: [],
  mapPositionUpdatedOnce: false,
  selectedMarker: ''
}

  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <View style={{flex: 1, backgroundColor: '#9D9D6'}}>
          {/* <Text style={{ textAlign: 'center', color: '#52AF52', fontSize: 20, fontWeight: '500', marginTop: 10 }}>
            What is your group size?
          </Text> */}
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('RegistrationSelectHunt'); }} style={styles.buttonGreenStyle}>
            <Text style={styles.buttonGreenTextStyle}>
              Small Group (1-10 People)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('RegistrationLargeGroup'); }} style={styles.buttonWhiteStyle}>
            <Text style={styles.buttonWhiteTextStyle}>
              Private Event/Corporate Event*
            </Text>
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, marginRight: 10, textAlign: 'center', fontSize: 12, fontFamily: 'CircularStd-Black' }}>  *Select this option only if you are part of an event, where a custom hunt was created.  </Text>
          </View>
      );
    }
  }

  const Container = styled.View`
  background-color: #464D4F;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;

const styles = {
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
  }
};
export default RegistrationGroupType;
