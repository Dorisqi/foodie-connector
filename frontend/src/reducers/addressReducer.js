import {
  LOAD_ADDRESS,
  SELECT_ADDRESS,
  CLEAR_ADDRESS,
  SET_CURRENT_LOCATION
} from 'actions/addressActions';

const initialState = {
  selectedAddress: null,
  addresses: null,
  currentLocation: null,
};

function addressReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ADDRESS:
      return {
        ...initialState,
        addresses: action.addresses,
      };
    case SELECT_ADDRESS:
      return {
        ...state,
        selectedAddress: action.selectedAddress,
      };
    case CLEAR_ADDRESS:
      return initialState;
    case SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.currentLocation,
      };
    default:
      return state;
  }
}

export default addressReducer;
