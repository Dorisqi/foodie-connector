import { combineReducers } from 'redux';
import addressReducer from './addressReducer';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
  address: addressReducer,
  cart: cartReducer,
});

export default rootReducer;
