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
import * as Animatable from 'react-native-animatable';




export default class AppFooter extends Component {
  render() {
      let leftOrRight = 0 
      if (this.props.completionData != null ){
        leftOrRight = Object.values(this.props.completionData).length % 2;
      }
      let reviewsObject = this.props.screenProps.groupInfo.players[this.props.screenProps.user.info.userId].reviews

      let characterImageSource = null;

      console.log('the character is', this.props.character)
      
      if(this.props.character == 'explorer') {
        characterImageSource= require('../../../images/explorerIcon.png')
      }
      if(this.props.character == 'branaic') {
        characterImageSource= require('../../../images/braniacIcon.png')
      }
      if(this.props.character == 'photographer') {
        characterImageSource= require('../../../images/photographerIcon.png')
      }
      if(this.props.character == 'student') {
        characterImageSource= require('../../../images/studentIcon.png')
      }
      if(this.props.character == 'youngster') {
        characterImageSource= require('../../../images/youngsterIcon.png')
      }

      console.log('the character image source is', characterImageSource)


      if (this.props.screenProps.groupInfo.huntFinished) {
      return (
        <View style={{position: 'absolute', left: 0, right: 0, bottom: 0 }}  >
        <View style={{position: 'absolute', justifyContent: 'flex-start', bottom: 0, height: 185, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', paddingTop: 95 }} pointerEvents="none"  >
          
  
          {/* Center Icon and Button*/}
          <View style={{height: 85, width: 100, paddingTop: 0, alignItems: 'center'}}  >
            <Image
              style={{height: 65, width: 71,  resizeMode: 'stretch'}}
              source={characterImageSource}
              resizeMethod={"resize"}
            />
            <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 10, textAlign: 'center'}}>
              {this.props.screenProps.user.info.firstName}
              </Text>
              <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 10, textAlign: 'center'}}>
              {'Level 1'}
              </Text>
          </View>

        
      {/* feedback popup */}
      {reviewsObject == null && 1==2 &&
          <View style={{position: 'absolute', bottom: 40, left: this.props.width/2+30, height: 100, width: 120}} >
            <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} >
              <Svg height={50} width={120}>
                <Polygon
                points="0,50 10,40 10,0 120,0 120,40 35,40 0,50"
                fill="#E87722"
                />
              </Svg>
            </View>
            <View style={{position: 'absolute', top: 0, left: 20, bottom: 40, right: 0}} >
              <Text style={{ fontFamily: 'CircularStd-Black', fontSize: 12, color: 'white', textAlign: 'center' }}>
                {'THANKS!'}
              </Text>
            </View>
            
            {/* {this.state.timeRemaining != null && this.state.questionAnsweredCorrectly == true &&
              <
            } */}
          </View>
      }
      {reviewsObject != null && reviewsObject.bonusReviewDone == null && (reviewsObject.r_hunt + reviewsObject.r_app > 8) && 1==2 &&
          <View style={{position: 'absolute', bottom: 40, right: this.props.width/2+30, height: 100, width: 120}} >
            <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} >
              <Svg height={50} width={120}>
                <Polygon
                points="120,50 95,40 0,40 0,0 105,0 105,40 105,40 120,50"
                fill="#E87722"
                />
              </Svg>
            </View>
            <View style={{position: 'absolute', top: 0, right: 20, bottom: 40, left: 0}} >
              <Text style={{ fontFamily: 'CircularStd-Black', fontSize: 12, color: 'white', textAlign: 'center' }}>
                {'Almost There'}
              </Text>
            </View>
            
            {/* {this.state.timeRemaining != null && this.state.questionAnsweredCorrectly == true &&
              <
            } */}
          </View>
      }


      </View> 
      </View>
      )
    }
      else if (this.props.showFooter && this.props.gameView == 'Treasure') {
        return (
          <View style={{position: 'absolute', left: 0, right: 0, bottom: 0 }}  >
            <View style={{position: 'absolute', justifyContent: 'flex-start', bottom: 0, height: 185, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 95 }} pointerEvents="none"  >
              <View style={{height: 85, width: 100, paddingTop: 0, alignItems: 'center'}}  >
                <Image
                  style={{height: 65, width: 71,  resizeMode: 'stretch'}}
                  source={characterImageSource}
                  resizeMethod={"resize"}
                />
                <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 10, textAlign: 'center'}}>
                  {this.props.user}
                  </Text>
                  <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 10, textAlign: 'center'}}>
                  {'Level 1'}
                  </Text>
              </View>
              <View style={{height: 85, width: (this.props.width-100), paddingTop: 5}} >
                  <Svg height={60} width={this.props.width-100}>
                    <Polygon
                    points={"0,0 "+(this.props.width-100)+",0 "+(this.props.width-100)+",60 0,60 30,30"}
                    fill="#6AAEAA"
                    />
                  </Svg>
                </View>
              </View>

              <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', 
                  right: this.props.width-100-80, bottom: 25, alignContent: 'center', height: 60, width: 90, flexDirection: 'row'}}
                   >
                  <View  style={{height: 60, width: 50}} pointerEvents="box-only" />
                    <View
                      style={{alignItems: 'center'}} 
                    >
                      <Image 
                        source={require('../../../images/treasureMap.png')}
                        style={{height: 25*1.2, width: 35*1.2}}
                      />
                      <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 11, textAlign: 'center'}}>
                      {'TREASURE'}
                      </Text>
                  </View>
                </View>

              {/* Treasure map button */}
              <TouchableOpacity 
                style={{alignItems: 'center', position: 'absolute', alignItems: 'flex-end', width: this.props.width-100, height: 85, bottom: 0, right: 0}} 
                onPress={() => this.props.updateGameView('Location')}
              >
                <Text
                  style={{textAlign: 'right', marginRight: 20, color: 'white', fontSize: 25, fontFamily: 'Alternate Gothic No3 D', marginTop: 15}}
                >
                  Go Back To Hunt
                </Text>
              </TouchableOpacity>
          </View>
        )
      }
      if (this.props.showFooter && this.props.gameView == 'Player') {
        return (
          <View style={{position: 'absolute', left: 0, right: 0, bottom: 0 }}  >
            <View style={{position: 'absolute', justifyContent: 'flex-start', bottom: 0, height: 185, left: 0, right: 0, flexDirection: 'row-reverse', justifyContent: 'space-between', paddingTop: 95 }} pointerEvents="none"  >
              <View style={{height: 85, width: 100, paddingTop: 0, alignItems: 'center'}}  >
                <Image
                  style={{height: 65, width: 71,  resizeMode: 'stretch'}}
                  source={characterImageSource}
                  resizeMethod={"resize"}
                />
                <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 10, textAlign: 'center'}}>
                  {this.props.screenProps.user.info.firstName}
                  </Text>
                  <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 10, textAlign: 'center'}}>
                  {'Level 1'}
                  </Text>
              </View>
              <View style={{height: 85, width: (this.props.width-100), paddingTop: 5}} >
                <Svg height={60} width={this.props.width-100}>
                  <Polygon
                    points={"0,0 "+(this.props.width-100)+",0 "+(this.props.width-130)+",30 "+(this.props.width-100)+",60 0,60"}
                    fill="#E87722"
                  />
                </Svg>
              </View>
              </View>

              <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', 
                  left: this.props.width-100-130, bottom: 25, alignContent: 'center', height: 60, width: 90, flexDirection: 'row'}}
                   >
                  <View  style={{height: 60, width: 50}} pointerEvents="box-only" />
                    <View
                      style={{alignItems: 'center'}} 
                    >
                      <Image 
                      source={require('../../../images/logo.png')}
                      style={{height: 35, width: 25}}
                      />
                  <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 11, textAlign: 'center'}}>
                  {'CHALLENGES'}
                  </Text>
                  </View>
                </View>

              {/* Treasure map button */}
              <TouchableOpacity 
                style={{alignItems: 'center', position: 'absolute', alignItems: 'flex-start', width: this.props.width-100, height: 85, bottom: 0, left: 0}} 
                onPress={() => this.props.updateGameView('Location')}
              >
                <Text
                  style={{textAlign: 'left', marginLeft: 20, color: 'white', fontSize: 25, fontFamily: 'Alternate Gothic No3 D', marginTop: 15}}
                >
                  Go Back To Hunt
                </Text>
              </TouchableOpacity>
          </View>
        )
      }

      else if (this.props.showFooter) {
        return (
          <View style={{position: 'absolute', left: 0, right: 0, bottom: 0 }}  >
          <View style={{position: 'absolute', justifyContent: 'flex-start', bottom: 0, height: 185, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 95 }} pointerEvents="none"  >
            
            {/* Challenges Button*/}
            <View style={{height: 85, width: 100, paddingTop: 5}}  >
              <Svg height={60} width={100}>
                <Polygon
                points="0,0 100,0 70,30 100,60 0,60"
                fill="#E87722"
                />
              </Svg>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', alignContent: 'center', height: 60, width: 70, position: 'absolute', left: 0, bottom: 25}} >
                  <Image 
                    source={require('../../../images/logo.png')}
                    style={{height: 35, width: 25}}
                  />
                  <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 11, textAlign: 'center'}}>
                  {'CHALLENGES'}
                  </Text>
                </View>
    
            {/* Center Icon and Button*/}
            <View style={{height: 85, width: 100, paddingTop: 0, alignItems: 'center'}}  >
              <Image
                style={{height: 65, width: 71,  resizeMode: 'stretch'}}
                source={characterImageSource}
                resizeMethod={"resize"}
              />
              <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 10, textAlign: 'center'}}>
                {this.props.screenProps.user.info.firstName}
                </Text>
                <Text style={{color: '#505759', fontFamily: 'Alternate Gothic No3 D', fontSize: 10, textAlign: 'center'}}>
                {'Level 1'}
                </Text>
            </View>
    
            {/* Treasure Map Button */}
            <View style={{height: 85, width: 100, paddingTop: 5}} >
              <Svg height={60} width={100}>
                <Polygon
                points="0,0 100,0 100,60 0,60 30,30"
                fill="#6AAEAA"
                />
              </Svg>
    
            </View>
            <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', 
                  right: 20, bottom: 25, alignContent: 'center', height: 60, width: 90, flexDirection: 'row'}}
                   >
                  <View  style={{height: 60, width: 50}} pointerEvents="box-only" />
                    <View
                      style={{alignItems: 'center'}} 
                    >
                      <Image 
                        source={require('../../../images/treasureMap.png')}
                        style={{height: 25*1.2, width: 35*1.2}}
                      />
                      <Text style={{color: 'white', fontFamily: 'Alternate Gothic No3 D', fontSize: 11, textAlign: 'center'}}>
                      {'TREASURE'}
                      </Text>
                  </View>
                </View>
          
        {/* feedback popup */}
        {this.props.feedback != null && leftOrRight == 0 && this.props.gameView == 'Location' &&
            <Animatable.View animation="fadeOut" delay={2500} style={{position: 'absolute', bottom: 40, left: this.props.width/2+30, height: 100, width: 120}} >
              <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} >
                <Svg height={50} width={120}>
                  <Polygon
                  points="0,50 10,40 10,0 120,0 120,40 35,40 0,50"
                  fill="#E87722"
                  />
                </Svg>
              </View>
              <View style={{position: 'absolute', top: 0, left: 20, bottom: 40, right: 0}} >
                <Text style={{ fontFamily: 'CircularStd-Black', fontSize: 12, color: 'white', textAlign: 'center' }}>
                  {this.props.feedback}
                </Text>
              </View>
              
              {/* {this.state.timeRemaining != null && this.state.questionAnsweredCorrectly == true &&
                <
              } */}
            </Animatable.View>
        }
        {this.props.feedback != null && leftOrRight == 1 && this.props.gameView == 'Location' &&
             <Animatable.View animation="fadeOut" delay={2500} style={{position: 'absolute', bottom: 40, right: this.props.width/2+30, height: 100, width: 120}} >
              <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} >
                <Svg height={50} width={120}>
                  <Polygon
                  points="120,50 95,40 0,40 0,0 105,0 105,40 105,40 120,50"
                  fill="#E87722"
                  />
                </Svg>
              </View>
              <View style={{position: 'absolute', top: 0, right: 20, bottom: 40, left: 0}} >
                <Text style={{ fontFamily: 'CircularStd-Black', fontSize: 12, color: 'white', textAlign: 'center' }}>
                  {this.props.feedback}
                </Text>
              </View>
              
              {/* {this.state.timeRemaining != null && this.state.questionAnsweredCorrectly == true &&
                <
              } */}
            </Animatable.View>
        }


        </View> 
        {/* Treasure map button */}
        <TouchableOpacity 
          style={{alignItems: 'center', position: 'absolute', width: 100, height: 85, bottom: 0, right: 0}} 
          onPress={() => this.props.updateGameView('Treasure')}
        />
        <TouchableOpacity 
          style={{alignItems: 'center', position: 'absolute', width: 100, height: 85, bottom: 0, left: 0}} 
          onPress={() => this.props.updateGameView('Player')}
        />
        </View>
        )
      } else {
         return null
      }
    }
  }