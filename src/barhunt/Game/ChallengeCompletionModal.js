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
  AsyncStorage,
  Image,
  Dimensions,
  Linking,
  ScrollView,
  ImageBackground,
  FlatList
} from 'react-native';
import styled from 'styled-components';
import { getDatabase } from "../../utils/db";
import uuid from 'uuid/v4';
import Icon from 'react-native-vector-icons/FontAwesome';
let { width, height } = Dimensions.get("window");
import Modal from 'react-native-modal';
import moment from 'moment';
import helpers from '../../utils/helpers';
let { ordinalSuffixOf, getColorWithChallengeType } = helpers;
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';


import ModalCloseButton from '../../modules/ModalCloseButton';

const BackButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 20;
  left: 20;
  z-index: 10;
  margin-left: 5;
`;

export default class extends Component {

  handleCameraPress = () => {

    let { challengeObj, challengePackId } = this.props.data;
    let { completionHandler, usersCompleted, userList, barHuntId, savePhotoVideoTypeChallengeCompletionHandler } = this.props;

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

        let imageId = uuid();
        let imagePath = `images/${barHuntId}/${imageId}`;

        // url: images/$barHuntId/$imageId
        firebase
          .storage()
          .ref(imagePath)
          .putFile(
            uri
          )
          .then(async (response) => {

            // create challenge completion object
            let imageRef = response.ref;
            let downloadURL = response.downloadURL;

            let challengeCompletionObject = {
              id: uuid(),
              userId: this.props.userId,
              challengePackId,
              completionTime: moment().utc().format(),
              challengeId: challengeObj.challengeId,
              downloadURL,
              imageRef
            }

            await savePhotoVideoTypeChallengeCompletionHandler(challengeCompletionObject);
          })
          .catch((err) => {
            console.log(err);
          });

      }
    });


  }

  render() {
    let { challengeObj, challengePackId } = this.props.data;
    let { completionHandler, usersCompleted, userList } = this.props;

    let mapArray = []
    for (let j = 0; j < challengeObj.challengeMaxCompletions; j++) {
      mapArray.push(j);
    }

    let { challengeType } = challengeObj;
    let bgColor = getColorWithChallengeType(challengeType);


    return (
      <Modal isVisible={this.props.show} transparent={true} >
        <View style={{ flex: 1, backgroundColor: bgColor, padding: 5 }}>
          <ModalCloseButton onPress={this.props.handleClose} />
          <ContentContainerView>
            <ScrollView style={{ flex: 1 }}>
              <Title>{challengeObj != null && challengeObj.challengeTitle}</Title>
              <Description>
                {challengeObj != null && challengeObj.challengeText}
              </Description>

              {/* winner list - not show for photo/video challenge */}
              { (usersCompleted.length > 0) &&
                <View>
                  <WinnersTitleText>
                    WINNERS
                  </WinnersTitleText>
                  <WinnersView>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {usersCompleted.map(({ userObj, completionObj }, index) => {
                        let { firstName, lastName } = userObj;
                        let profileUrl = userObj.photoUrl;
                        let completionImage = completionObj.downloadURL;
                        // if this is non-photo/video type of completion, show profile image
                        // if this is photo/video type of completion, show the completion photo
                        
                        return <WinnerCellView
                          style={{ width: width * .23, marginRight: 10, marginTop: 5 }}
                        >
                          <PlaceText>{ordinalSuffixOf(index + 1)}</PlaceText>
                          <ImageBackground
                            style={{
                              width: width * 0.23,
                              height: width * 0.23,
                              justifyContent: "space-between",
                              padding: 5
                            }}
                            source={{ uri: (challengeType == "photo/video") ? completionImage : profileUrl }}
                          >
                            <NameText>{firstName}</NameText>
                            <ScoreText>{Math.max(challengeObj.challengeMaxPoints - index, 1)}</ScoreText>
                          </ImageBackground>
                        </WinnerCellView>
                      })}
                    </View>
                  </WinnersView>
                </View>}

              {/* user list - not show for photo/video type of challenges */}
              {challengeType !== "photo/video" && (usersCompleted.length < challengeObj.challengeMaxCompletions || usersCompleted == {} || usersCompleted == []) &&
                <View>
                  <WinnersTitleText>Validate Completing Player</WinnersTitleText>

                  <FlatList
                    style={{ marginTop: 10 }}
                    data={userList}
                    keyExtractor={(item, index) => { return item.userId }}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity onPress={async () => {
                          let completionTime = moment().utc().format();

                          // construct completion object
                          // send to firebase
                          let completionObj = {
                            id: uuid(),
                            challengeId: challengeObj.challengeId,
                            challengePackId: challengePackId,
                            userId: item.userId,
                            completionTime
                          }
                          await completionHandler(completionObj);

                        }}>
                          <NameListText>{item.firstName} {item.lastName}</NameListText>
                        </TouchableOpacity>
                      )

                    }}
                  />
                </View>
              }

              {/* upload photo - shown only for photo/video type of challenges */}
              {challengeType == "photo/video" &&
                <View>
                  <WinnersTitleText>Upload Photo/Video</WinnersTitleText>
                  <TouchableOpacity onPress={this.handleCameraPress}>
                    <Icon name="camera" size={100} color="#505759" style={{ alignSelf: "center", marginTop: 10 }} />
                  </TouchableOpacity>
                </View>

              }

            </ScrollView>
          </ContentContainerView>
        </View>
      </Modal>
    )
  }

};


// modal content
const ContentContainerView = styled.View`
  flex: 1;
  border-color: #505759;
  border-width: 8px;
  padding: 10px;
  justify-content: flex-start;
  padding-top: 50px;
`;

const Title = styled.Text`
  font-size: 40px;
  color: #505759;
  border-bottom-width: 5px;
  border-bottom-color: #505759;
`;

const Description = styled.Text`
  margin-top: 10px;
  font-size: 24px;
  color: #505759;
`;

const WinnersTitleText = styled.Text`
  align-self: center;
  font-size: 35px;
  text-align: center;
  color: #505759;
  margin-top: 30px;
`;


// winners scrollView

const WinnersView = styled.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
`;

const WinnerCellView = styled.TouchableOpacity`
  height: 110px;
`;

const NameText = styled.Text`
  font-size: 20px;
  margin-bottom: 10px;
  color: white;
`;

const ScoreText = styled.Text`
  font-size: 50px;
  margin-bottom: 10px;
  color: white;
  align-self: flex-end;
  color: #E56B1F;
`;

const PlaceText = styled.Text`
  text-align: center;
  font-size: 20px;
  margin-bottom: 5px;
  color: #505759;
`;

// name list

const NameListText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
  color: #505759;
`;