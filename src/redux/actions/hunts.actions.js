
import axios from 'axios';
import * as types from './actionTypes';
//actions are the logic to get the data
//once we have a response, the reducer assigns the data to the specific property of the state object

export function retrieveHuntList() {
	return function (dispatch) {
		return axios.get('https://www.scavengerhunt.com/app/ios_ajax_json_hunt_locations.php/ios_ajax_hunt_locations.php?password=asf4fvadfv31das')
		.then(res => { dispatch(retrieveHuntListSuccess(Object.values(res.data)));
			console.log(res.data)
		console.log('the hunt data has finished downloading') });
	};
}

export function retrieveHuntListSuccess(res) {
	return {
		type: types.RETRIEVE_HUNT_LIST,
		hunts: res
	};
}
