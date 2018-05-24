import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Svg, {Polygon} from 'react-native-svg'

export default class AppHeader extends Component {
    render() {
      let team_name=this.props.teamName;
      let team_name_formatted= team_name.length > 25 ? team_name.substring(0, 23) + '...' : team_name;

      let completionData = this.props.completionData
      let treasureCompletionData = this.props.treasureCompletionData
      let playerCompletionData = this.props.playerCompletionData
      console.log('the completion data is')
      console.log(completionData)
  
       //Calculating the number of points for the team in total 
       let teamPoints = 0;
       if (completionData != null) {
          Object.values(completionData).map((completion) => {
            completion.correctAnswer = typeof completion.correctAnswer != 'number' ? completion.correctAnswer.toLowerCase() : completion.correctAnswer 
            completion.guess = typeof completion.guess != 'number' ? completion.guess.toLowerCase() : completion.guess 
            if (completion.guess == completion.correctAnswer) {
              teamPoints = teamPoints + completion.pointsEarned + completion.lightningRoundBonusPoints
              console.log('team points was updated')
              console.log(completion.pointsEarned)
            }
        })
       }

       if (treasureCompletionData != null) {
        Object.values(treasureCompletionData).map((completion) => {
          teamPoints = teamPoints + completion.pointsEarned
        })
      }

      if (playerCompletionData != null) {
        previouslyAssignedChallengesArray = Object.values(playerCompletionData)
          previouslyAssignedChallengesArray.map((user) => {
            Object.values(user).map((challengeId) => {
              teamPoints = teamPoints + challengeId.pointsEarned
          })
        })
      }
      
      return (
        <View style={{position: 'absolute', top: (Platform.OS === 'ios') ? 75 : 55, height: 70, left: 0, right: 0}} >
          
          {/* Header Image */}
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} >
            <Image source={this.props.imageSource}
              style={{flex: 1, height: 130}} />
          </View> 
  
          {/* Header Text */}
          <View style={{position: 'absolute', backgroundColor: 'rgba(80,87,89,0.5)', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end'}} >
            <Svg height={25} width={240}>
              <Polygon
              points="0,0 220,0 207.5,12.5 220,25 0,25"
              fill="#E87722"
              />
            </Svg>
            <View style={{justifyContent: 'center', alignContent: 'center', left: 4, bottom: 27, position: 'absolute'}}>
                <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 20}}>
                {team_name_formatted.toUpperCase()}
                </Text>
              </View>
            <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 14, marginBottom: 5, marginTop: 5, marginLeft: 5}}>
              {'Team Score: '+ teamPoints +'pts'}
            </Text>
          </View>
        </View>
      )
    }
  } 