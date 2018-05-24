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
  Alert,
  Image,
  Dimensions
} from 'react-native';
import styled from 'styled-components';
let {width, height} = Dimensions.get("window");

// calculate the width of small button
let smallButtonWidth = ((width - 30 - 30) - 8) / 2;

const ButtonContainer = styled.View`
  justify-content: center;
  align-items: center;
  
`;

const SmallButtonView = styled.View`
  justify-content: center;
  align-items: center;
`;

const SmallButtonText = styled.Text`
  font-size: 20px;
  text-align: center;
`;

export default class extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <TouchableOpacity style={{ backgroundColor: this.props.bgColor, width: smallButtonWidth, height: this.props.buttonHeight}} onPress={this.props.onPress}>
        <ButtonContainer style={{ flex: 1 }}>
          <SmallButtonView style={{backgroundColor: this.props.bgColor, flex: 1}}>
            <SmallButtonText style={this.props.textStyle}>{this.props.text}</SmallButtonText>
          </SmallButtonView>
        </ButtonContainer>
      </TouchableOpacity>
    );
  }
};
