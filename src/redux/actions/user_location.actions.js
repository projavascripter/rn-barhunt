import * as types from './actionTypes';

export function saveUserLocation(position) {
	//dispatch is an internal function that fires the reducer
	return function (dispatch) {
		dispatch(saveUserLocationSuccess(position));
	};
}

export function saveUserLocationSuccess(position) {
	return {
		type: types.RETRIEVE_USER_LOCATION,
		region: {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
			latitudeDelta: 40,
			longitudeDelta: 60
		  }
	};
}
