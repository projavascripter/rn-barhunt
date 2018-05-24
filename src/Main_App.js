/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import Drawer from './Drawer'

//defining redux
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createMemoryHistory from 'history/createMemoryHistory';

//defining reducers (more to come soon :) ) 
import huntsReducer from './redux/reducers/hunts.reducer';
import saveUserLocationReducer from './redux/reducers/user_location.reducer';
import saveUserInfoReducer from './redux/reducers/user_info.reducer';


//MIDDLEWARE
let middleware = [thunk];
const history = createMemoryHistory()
const routerMW = routerMiddleware(history);

middleware = [...middleware, routerMW];

//ONLY FOR DEBUGGING
if (1 == 1) {
	const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
	const logger = createLogger({ collapsed: true });
	middleware = [...middleware, reduxImmutableStateInvariant, logger];
} 
else {
	middleware = [...middleware];
}

//CREATE STORE
const store = createStore(
	combineReducers({
    hunts: huntsReducer,
    location: saveUserLocationReducer,
    user: saveUserInfoReducer
	}),
	applyMiddleware(...middleware)
);

export default class App extends Component {
  render () {
    return (
      <Provider store={store}> 
        <Drawer/>
      </Provider>
    );
  }
}
;

