export const LOAD_ADDRESS = 'LOAD_ADDRESS';
export const SELECT_ADDRESS = 'SELECT_ADDRESS';
export const CLEAR_ADDRESS = 'CLEAR_ADDRESS';
export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';

export function loadAddress(addresses) {
  return {
    type: LOAD_ADDRESS,
    addresses,
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
  }
}

export function setCurrentLocation(currentLocation) {
  return {
    type: SET_CURRENT_LOCATION,
    currentLocation,
  }
}
