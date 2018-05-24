/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import {
  setCustomText
} from 'react-native-global-props';

const customTextProps = {
  style: {
    fontSize: 16,
    fontFamily: "Alternate Gothic No3 D",
    color: 'black'
  }
};

setCustomText(customTextProps);

// Invariant of userId

// if userId is set in AsyncStorage, then it is logged in
// otherwise, the user is not logged




// for testing
// AsyncStorage.setItem("userId", "b986420d-f617-4e3b-a85e-b908cb89e457").then(() => {
//   console.log('finished setting testing userId');
// })

// AsyncStorage.setItem("userId", "b986420d-f617-4e3b-a85e-b908cb89e457");
// AsyncStorage.removeItem("userId");
import Main_App from './src/Main_App';
export default Main_App;