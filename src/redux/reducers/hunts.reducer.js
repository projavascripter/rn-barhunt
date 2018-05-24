import * as types from '../actions/actionTypes';

//actions are the logic to get the data
//once we have a response, the reducer assigns the data to the specific property of the state object

const initialState = {
	items:[]
};

export default function (state = initialState, action) {
	switch (action.type) {

		case types.RETRIEVE_HUNT_LIST:
			return {
				...state,
				items: action.hunts
			};

		default:
			return state;
	}
}
