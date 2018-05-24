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
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import styled from 'styled-components';
import { getDatabase, getStorage } from "../utils/db";
import uuid from 'uuid/v4';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';

const Title = styled.Text`
  font-size: 30px;
  text-align: center;
`;

const ButtonText = styled.Text`
  text-align: center;
  font-size: 50px;
`;

export default class extends Component {

  componentDidMount() {

    // console.log(firebase.database().app.name); // '[DEFAULT]'

    // const ref = firebase.storage().ref('a/a.jpg');
    // ref.put("abc", (snapshot) => {
    //   console.log("me")
    // })

    // var message = 'This is my message.';
    // ref.put(message).then(function (snapshot) {
    //   console.log('Uploaded a raw string!');
    // });




  }

  state = {

  }

  render() {
    return (
      <View>
        <Title>Choose or take Profile picture</Title>
        <TouchableOpacity onPress={async () => {

          // More info on all the options is below in the README...just some common use cases shown here
          var options = {
            title: 'Select Avatar',
            // customButtons: [
            //   {name: 'fb', title: 'Choose Photo from Facebook'},
            // ],
            storageOptions: {
              skipBackup: true,
              path: 'images'
            }
          };

          ImagePicker.showImagePicker(options, async (response) => {
            console.log('Response = ', response);
            let { height, width } = response;

            if (response.didCancel) {
              console.log('User cancelled image picker');
            }
            else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            }
            else {

              let uri = response.uri;

              firebase
                .storage()
                .ref('/mike.jpeg')
                .putFile(
                  uri
                )
                .then(() => {
                  console.log('good');
                })
                .catch((err) => {
                  console.log('bad');
                  console.log(err);
                });

            }
          });

        }}>
          <ButtonText>+</ButtonText>
        </TouchableOpacity>
        <Image
          source={this.state.avatarSource}
          style={{ width: this.state.width / 3, height: this.state.height / 3 }}
        />
      </View>
    );
  }
};

