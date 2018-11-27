export const LOAD_ORDER = 'LOAD_ORDER';
export const ALL_MEMBERS = 'ALL_MEMBERS';

export function loadOrderinfo(orderId,restaurantId,is_public,creator) {
  return {
    type: LOAD_ORDER,
    orderId,
    restaurantId,
    is_public,
    creator,

  };
}

export function updateGroupmember(order_members) {
  return {
    type: ALL_MEMBERS,
    order_members,

  };
}
