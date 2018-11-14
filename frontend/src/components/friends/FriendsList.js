import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { loadFriends, followFriend } from 'actions/friendsActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import Api from 'facades/Api';
import Axios from 'facades/Axios';

const styles = () => ({
  selector: {
    boxSizing: 'border-box',
  },
  root: {
    width: '100%',
    maxWidth: '360px',
    backgroundColor: theme.palette.background.paper,
  },
});

class FriendsList extends React.component{
  state={
    friends:[],
    addingFriend: false,


  };

  componentDidMount() {
    this.loadFriends();
  }

  componentWillUnmount() {
    //Axios.cancelRequest(this.state.loadingAddress);
  }

  handleNewfollowingClose = () => {
    this.setState({
      addingFriend: false,
    });
  };

  loadFriends() {
  /*  Axios.cancelRequest(this.state.loadingAddress);
    this.setState({
      loadingAddress: Api.addressList().then((res) => {
        this.setState({
          loadingAddress: null,
        });
        const addresses = res.data;
        store.dispatch(loadAddress(addresses));
        if (addresses.length === 0) {
          this.loadCurrentLocation();
        }
      }).catch((err) => {
        this.setState({
          loadingAddress: null,
        });
        throw (err);
      }),
    });
  }*/

}


render() {
  const { friends, classes} = this.props;

  return (
    <div>
      {addingFriend
      && (
      <FollowfriendDialog
        onClose={this.handleNewfollowingClose}
      />
      )
      }

    </div>
  );
}
}

const mapStateToProps = state => ({
friends: state.address.friends,
});


export default withStyles(styles)(
connect(mapStateToProps)(FriendsList),
);
