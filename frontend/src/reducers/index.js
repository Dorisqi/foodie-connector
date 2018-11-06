import { combineReducers } from 'redux';
import addressReducer from './addressReducer';

const rootReducer = combineReducers({
  address: addressReducer,
});

export default rootReducer;
