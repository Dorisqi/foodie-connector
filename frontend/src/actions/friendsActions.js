export const LOAD_FRIENDS = 'LOAD_FRIENDS';
export const FOLLOW_FRIEND = 'FOLLOW_FRIEND';
export const UNFOLLOW_FRIEND = 'UNFOLLOW_FRIEND';


export function loadFriends(followingfriends) {
  return {
    type: LOAD_FRIENDS,
    followingfriends,
  };
}

export function followFriend(friend_email) {
  return {
    type: FOLLOW_FRIEND,
    friend_email,
  };
}

export function unfollowFriend(friend_email) {
  return {
    type: UNFOLLOW_FRIEND,
    friend_email,
  };
}
