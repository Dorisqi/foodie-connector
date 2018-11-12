import {
  LOAD_ADDRESS,
  SELECT_ADDRESS,
  CLEAR_ADDRESS,
  SET_CURRENT_LOCATION,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
} from 'actions/addressActions';
import _ from 'lodash';

const initialState = {
  selectedAddress: null,
  addresses: null,
  currentLocation: null,
};

function addressReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ADDRESS: {
      const { addresses } = action;
      const newState = {
        ...state,
        addresses,
      };
      if (action.reselect && addresses.length > 0) {
        const defaultIndex = _.findIndex(addresses, address => address.is_default);
        newState.selectedAddress = addresses[defaultIndex].id;
      }
      return newState;
    }
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
    case ADD_ADDRESS:
      return {
        ...state,
        addresses: [
          ...state.addresses,
          action.address,
        ],
        selectedAddress: action.address.id,
      };
    case UPDATE_ADDRESS: {
      const addresses = [...state.addresses];
      const index = _.findIndex(addresses, address => address.id === action.id);
      addresses[index] = action.address;
      return {
        ...state,
        addresses,
        selectedAddress: action.address.id,
      };
    }
    default:
      return state;
  }
}

export default addressReducer;
