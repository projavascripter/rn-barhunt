import * as types from '../actions/actionTypes';

//actions are the logic to get the data
//once we have a response, the reducer assigns the data to the specific property of the state object

const initialState = {
	info: null,
	loggedIn: false
};

export default function (state = initialState, action) {
	switch (action.type) {

		case types.RETRIEVE_USER_INFO:
			return {
				...state,
				info: action.info,
				loggedIn: action.loggedIn
			};

		case types.LOGOUT_USER_INFO:
			return {
				...state,
				info: action.info,
				loggedIn: action.loggedIn
			};
			
		default:
			return state;
	}
}