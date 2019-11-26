import * as Actions from '../actions';
import console = require('console');
  
  const INITIAL_STATE = {};
  
  export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
      case Actions.SET_HOME_DATA:
        return action.payload;
      case Actions.GET_JOB_OFFER:
        console.log(action.payload)
        return action.payload;
      default:
        return state;
    }
  }