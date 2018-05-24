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

import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps';



export default class extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <MapView
        showsUserLocation
        style={{flex: 1}}
        initialRegion={{
          latitude: parseFloat(this.props.lat),
          longitude: parseFloat(this.props.lon),
          latitudeDelta: 0.0722,
          longitudeDelta: 0.0321,
        }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(this.props.lat),
            longitude: parseFloat(this.props.lon),
          }}
          title={'Next Stop'}
    />
      </MapView>

    );
  }
};
