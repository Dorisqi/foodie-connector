export const CART_UPDATE = 'CART_UPDATE';
export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_CLEAR = 'CART_CLEAR';
export const CART_CLOSE_CLEAR_ALERT = 'CART_CLOSE_CLEAR_ALERT';
export const CART_UPDATE_AMOUNT = 'CART_UPDATE_AMOUNT';
export const CART_UPDATE_ITEM = 'CART_UPDATE_ITEM';

export function cartUpdate(cart) {
  return {
    type: CART_UPDATE,
    cart,
  };
}

export function cartAddItem(restaurantId, restaurantName, item) {
  return {
    type: CART_ADD_ITEM,
    restaurantId,
    restaurantName,
    item,
  }
}

export function cartClear() {
  return {
    type: CART_CLEAR,
  }
}

export function cartCloseClearAlert() {
  return {
    type: CART_CLOSE_CLEAR_ALERT,
  }
}

export function cartUpdateAmount(cartIndex, productAmount) {
  return {
    type: CART_UPDATE_AMOUNT,
    cartIndex,
    productAmount,
  }
}

export function cartUpdateItem(cartIndex, item) {
  return {
    type: CART_UPDATE_ITEM,
    cartIndex,
    item,
  }
}
