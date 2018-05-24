import * as types from './actionTypes';
import {getDatabase} from '../../utils/db';
import {AsyncStorage} from "react-native";

export function saveUserInfo(user_id) {
	//dispatch is an internal function that fires the reducer
	return function (dispatch) {

		return getDatabase().ref(`users/${user_id}`).once('value')
		.then( result =>{
			const userInfo = result.val();
			if(!userInfo){
				console.log(`Warning: cannot get userInfo from firebase. Maybe the user does not exist.`);
			}
			else{
				dispatch(saveUserInfoSuccess(userInfo));
			}
		})
	};
}

export function saveUserInfoSuccess(info) {
	console.log(info);
	return {
		type: types.RETRIEVE_USER_INFO,
		info: info,
		loggedIn: true
	};
}


export function logOutUser() {
	//dispatch is an internal function that fires the reducer
	return function (dispatch) {
		dispatch(logOutUserSuccess());
	};
}

export function logOutUserSuccess() {
	console.log('the user is being logged out')
	return {
		type: types.LOGOUT_USER_INFO,
		info: null,
		loggedIn: false
	};
}
