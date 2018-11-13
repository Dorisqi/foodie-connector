export const LOAD_ADDRESS = 'LOAD_ADDRESS';
export const SELECT_ADDRESS = 'SELECT_ADDRESS';
export const CLEAR_ADDRESS = 'CLEAR_ADDRESS';
export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';
export const ADD_ADDRESS = 'ADD_ADDRESS';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';

export function loadAddress(addresses, selectedAddress = null) {
  return {
    type: LOAD_ADDRESS,
    addresses,
    selectedAddress,
  };
}

export function selectAddress(selectedAddress) {
  return {
    type: SELECT_ADDRESS,
    selectedAddress,
  };
}

export function clearAddress() {
  return {
    type: CLEAR_ADDRESS,
  };
}

export function setCurrentLocation(currentLocation) {
  return {
    type: SET_CURRENT_LOCATION,
    currentLocation,
  };
}

export function updateAddress(address) {
  return {
    type: UPDATE_ADDRESS,
    address,
  };
}

export function addAddress(address) {
  return {
    type: ADD_ADDRESS,
    address,
  };
}
