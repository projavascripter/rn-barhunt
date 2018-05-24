import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Image
} from 'react-native';
import styled from 'styled-components';
import { getDatabase } from "../utils/db";
import Profile from './Profile';
import uuid from 'uuid/v4';
import Icon from 'react-native-vector-icons/FontAwesome';
import fireUtil from '../utils/fireUtils';
import Modal from 'react-native-modal';
import {GoogleSignin} from 'react-native-google-signin';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

import { connect } from 'react-redux';
import { saveUserLocation } from '../redux/actions/user_location.actions';
import { saveUserInfo,logOutUser } from '../redux/actions/user_info.actions';

const google_ios_client_id = "472107255951-72uu587vuquodhkuhdoocnob81cmj4ju.apps.googleusercontent.com";

const Title = styled.Text`
  font-size: 25px;
  text-align: center;
  color: #E36B21;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ButtonText = styled.Text`
  text-align: center;
`;

const SocialLoginButtonContainer = styled.View`
  width: 140px;
  height: 40px;
  flex-direction: row;
  background-color: #DD4B39;
`;

const SocialLoginButtonIconContainer = styled.View`
  width: 50px;
  height: 40px;
  background-color: #DD4B39;
  justify-content: center;
  align-items: center;
`;

const SocialLoginButtonTextContainer = styled.View`
  flex-grow: 2;
  background-color: blue;
`;

class ModalLogin extends Component {

    componentDidMount() {
    }

    onFBClick = () =>{
        let user = null;
        let user_id = null;

        LoginManager.logInWithReadPermissions(["email", "user_friends"])
        .then( (result, a) =>{
            if (result.isCancelled) {
                alert('Login was cancelled');
                throw result;
            }
            return new Promise((resolve, reject) => {
                const infoRequest = new GraphRequest('/me',{
                    parameters: {
                        fields: {
                            string: 'email,name,first_name,middle_name,last_name,picture.type(large)' 
                        }
                    }
                },
                (error,result) => {
                    if (error) {
                        console.log('Error fetching data: ' + error.toString());
                        reject(error);
                    }
                    else{
                        resolve(result);
                    }
                });
                new GraphRequestManager().addRequest(infoRequest).start();
            });
        })
        .then(result =>{
            user = result;
            return getDatabase().ref().child("users").orderByChild("email").equalTo(result.email).once('value');
        })
        .then( result =>{
            console.log('Firebase response: ', result);
            if(result.val()){
                console.log('USER EXIST');
                user_id = Object.keys(result.val())[0];
                return;
            }
            else{
                console.log('USER DOESNT EXIST');
                const { id, email, first_name, last_name, picture: { data: { url } } } = user;
                user_id = uuid();
                const params = {
                    user_id,
                    email,
                    firstName: first_name,
                    lastName: last_name,
                    googleId: id,
                    photoUrl: url,
                    level: 1,
                    points: 0
                };
                return getDatabase().ref("users").child(user_id).set(params);
            }
        })
        .then(()=>{
            return AsyncStorage.setItem('userId', user_id);
        })
        .then( () =>{
            console.log('Login Finished: ', user_id);
            this.props.saveUserInfo(user_id);
            this.props.close();
        })
        .catch(error =>{
            console.log('FB Login Error:', error);
        });
    }

    onGoogleClick = () =>{
        console.log('Google clicked');
        let user = null;
        let user_id = null;
        GoogleSignin.hasPlayServices({autoResolve: true})
        .then( ()=>{
            return GoogleSignin.configure({
                forceConsentPrompt: true, hostedDomain: '',
                iosClientId: google_ios_client_id
            });
        })
        .then( () =>{
            return GoogleSignin.signIn();
        })
        .then( result =>{
            user = result;
            console.log(result);
            return getDatabase().ref().child("users").orderByChild("email").equalTo(result.email).once('value');
        })
        .then( result =>{
            console.log('Firebase response: ', result);
            if(result.val()){
                console.log('USER EXIST');
                user_id = Object.keys(result.val())[0];
                return;
            }
            else{
                console.log('USER DOESNT EXIST');
                const { email, givenName, familyName, id, photo } = user;
                user_id = uuid();
                const params = {
                    user_id,
                    email,
                    firstName: givenName,
                    lastName: familyName,
                    googleId: id,
                    photoUrl: photo,
                    level: 1,
                    points: 0
                };
                return getDatabase().ref("users").child(user_id).set(params);
            }
        })
        .then(()=>{
            return AsyncStorage.setItem('userId', user_id);
        })
        .then( () =>{
            console.log('Login Finished: ', user_id);
            this.props.saveUserInfo(user_id);
            this.props.close();
        })
        .catch(error =>{
            console.log('Google login error: ', error);
            alert('Login was cancelled');
        });
    }

    logout = () =>{
        console.log('logout clicked');
        GoogleSignin.hasPlayServices({autoResolve: true})
        .then( ()=>{
            return GoogleSignin.configure({
                forceConsentPrompt: true, hostedDomain: '',
                iosClientId: google_ios_client_id
            });
        })
        .then( () =>{
            return GoogleSignin.currentUserAsync();
        })
        .then(user =>{
            return GoogleSignin.signOut();
        })
        .then( () =>{
            console.log('GOOGLE LOGGED OUT');
            return AsyncStorage.removeItem("userId");
        })
        .then( () =>{
            console.log('FACEBOOK LOGGED OUT');
            return LoginManager.logOut();
        })
        .then( () =>{
            console.log('LOGOUT PROCESS COMPLETED');
            this.props.logOutUser();
            this.props.close();
        })
        .catch(error =>{
            console.log('Logout error: ', error);
        })
    }
    
    render() {
        const {user} = this.props;
        return (
            <Modal isVisible={this.props.show} key={user} transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <View style={{
                        height: 270,
                        width: 250,
                        backgroundColor: "white",
                        padding: 20,
                        alignItems: "center",
                        borderRadius: 5
                    }}>
                        <TouchableOpacity onPress={this.props.close} style={{ alignSelf: "flex-start" }}>
                            <Icon name="times" size={25} color="#E36B21" />
                        </TouchableOpacity>
                        <Text>
                            {user.loggedIn}
                        </Text>
                        {!user.loggedIn &&
                            <View>
                            <Title>SIGN IN</Title>

                            <TouchableOpacity onPress={this.onFBClick} >
                                <Image
                                    style={{ width: 200, height: 34 }}
                                    source={require('../images/facebook-login.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.onGoogleClick} style={{ marginTop: 5 }}>
                                <Image
                                    style={{ width: 200, height: 34 }}
                                    source={require('../images/google-login.png')}
                                />
                            </TouchableOpacity>
                            </View>
                        }
                        {user.loggedIn &&
                        <View>
                            <TouchableOpacity onPress={this.logout} >
                                <Title>Sign Out</Title>
                            </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </Modal>
        );
    }
};

const mapStateToProps = (state) => {
    const { user } = state;
    return { user };
}
const actions = { saveUserLocation, saveUserInfo,logOutUser };
ModalLogin = connect(mapStateToProps, actions)(ModalLogin);
export default ModalLogin;
