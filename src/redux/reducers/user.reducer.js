import * as Actions from '../actions';
  
  const INITIAL_STATE = {};
  
  export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
      case Actions.SET_USER_DATA:
        // alert(action.payload)
        return action.payload;
      default:
        return state;
    }
  }
  