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


export default class extends Component {

  constructor() {
    super();
  }

  render() {
    let { textSelected } = this.props;

    return (
      <Container>
        {this.props.textArr.map((text, index) => {
          {
            // the first item's border right width is 0
            let borderRightWidth = 1;
            if (index == 0) {
              borderRightWidth = 0;
            }

            // if the text is selected, show green bg with white text
            // otherwise, show white bg with black text
            return text == textSelected ?
              <Button
                onPress={this.props.buttonHandlers[index]}
                style={{ backgroundColor: "#53A6C4", borderRightWidth }}>
                <Text style={{ color: "white" }}>{text}</Text>
              </Button>
              :
              <Button
                onPress={this.props.buttonHandlers[index]}
                style={{ backgroundColor: "white", borderRightWidth }}>
                <Text style={{ color: "black" }}>{text}</Text>
              </Button>
          }

        })}

      </Container>
    );
  }
};

const Button = styled.TouchableOpacity`
  width: 60px;
  height: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
`;

const Container = styled.View`
  flex-direction: row;
  margin-top: 15px;
`;