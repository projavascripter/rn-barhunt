import * as types from '../actions/actionTypes';

//actions are the logic to get the data
//once we have a response, the reducer assigns the data to the specific property of the state object

const initialState = {
	region: null
};

export default function (state = initialState, action) {
	switch (action.type) {

		case types.RETRIEVE_USER_LOCATION:
			return {
				...state,
				region: action.region
			};

		default:
			return state;
	}
}
