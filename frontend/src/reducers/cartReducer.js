import Api from 'facades/Api';
import {
  CART_UPDATE,
  CART_ADD_ITEM,
  CART_CLEAR,
  CART_CLOSE_CLEAR_ALERT,
  CART_UPDATE_AMOUNT,
  CART_UPDATE_ITEM,
  cartUpdate,
} from 'actions/cartActions';
import store from 'store';

const initialState = {
  restaurantId: null,
  restaurantName: null,
  clearAlert: null,
  cart: [],
};

let loading = null;

function generateMap(cart) {
  const cartMap = {};
  cart.forEach((cartItem, index) => {
    cartMap[cartItem.product_id] = cartItem.product_option_groups.length > 0 ? true : index;
  });
  return cartMap;
}

function updateLocalCart(state) {
  state.cartMap = generateMap(state.cart);
  state.subtotal = state.cart.reduce((subtotal, item) =>
    subtotal + item.product_price * item.product_amount
  , 0).toFixed(2);
  return state;
}

function updateCart(state) {
  if (loading !== null){
    loading.cancel();
  }
  loading = Api.cartUpdate(state.restaurantId, state.cart).then((res) => {
    loading = null;
    store.dispatch(cartUpdate(res.data));
  }).catch((err) => {
    loading = null;
    throw err;
  });
  return updateLocalCart(state);
}

function cartReducer(state = null, action) {
  switch (action.type) {
    case CART_UPDATE: {
      const { cart } = action;
      const { restaurant, subtotal } = cart;
      return {
        restaurantId: restaurant === null ? null : restaurant.id,
        restaurantName: restaurant === null ? null : restaurant.name,
        clearAlert: null,
        cart: cart.cart,
        cartMap: generateMap(cart.cart),
        subtotal,
      };
    }
    case CART_ADD_ITEM: {
      if (state.restaurantId !== null && state.restaurantId !== action.restaurantId) {
        const cart = [action.item];
        return {
          ...state,
          clearAlert: {
            restaurantId: action.restaurantId,
            restaurantName: action.restaurantName,
            clearAlert: null,
            cart,
          },
        };
      }
      const cart = [...state.cart];
      const item = action.item;
      const sameItemIndex = state.cartMap[item.product_id];
      if (sameItemIndex === undefined || item.product_option_groups.length > 0) {
        // not in cart or item have options
        cart.push(action.item);
      } else {
        cart[sameItemIndex] = {
          ...action.item,
          product_amount: cart[sameItemIndex].product_amount + 1,
        };
      }
      return updateCart({
        restaurantId: action.restaurantId,
        restaurantName: action.restaurantName,
        clearAlert: null,
        cart,
      });
    }
    case CART_CLEAR:
      return updateCart(state.clearAlert !== null ? state.clearAlert : initialState);
    case CART_CLOSE_CLEAR_ALERT:
      return updateCart({
        ...state,
        clearAlert: null,
      });
    case CART_UPDATE_AMOUNT: {
      const cart = [...state.cart];
      if (action.productAmount === 0) {
        cart.splice(action.cartIndex, 1);
        return updateCart({
          ...state,
          cart,
        });
      } else {
        cart[action.cartIndex] = {
          ...cart[action.cartIndex],
          product_amount: action.productAmount,
        };
        return updateCart({
          ...state,
          cart,
        });
      }
    }
    case CART_UPDATE_ITEM: {
      const cart = [...state.cart];
      if (action.item.product_amount === 0) {
        cart.splice(action.cartIndex, 1);
        return updateCart({
          ...state,
          cart,
        });
      } else {
        cart[action.cartIndex] = action.item;
      }
      return updateCart({
        ...state,
        cart,
      });
    }
    default:
      return state;
  }
}

export default cartReducer;