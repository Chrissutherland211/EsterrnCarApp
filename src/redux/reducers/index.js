import { combineReducers } from 'redux';
import UserReducer from './user.reducer';
// import BirthReducer from './birth.reducer';
// import MailReducer from './mail.reducer';


export default combineReducers({
  user: UserReducer,
//   birth: BirthReducer,
//   mail: MailReducer
});