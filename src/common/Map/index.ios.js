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

import MyMapView from './MyMapView';

export default class extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <MyMapView
        {...this.props}
      />
    );
  }
};
