import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Api from 'facades/Api';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddCircle from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from 'facades/Snackbar';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';


const styles = theme => ({
  margin: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
  },
  root: {
    // width: '100%',
    maxWidth: '100px',
    backgroundColor: theme.palette.background.paper,
  },
  textarea: {
    minWidth: '500px',
  },
  setstatus: {
    flexGrow: 0,
    paddingRight: 0,
    minWidth: 'fit-content',
  },
});

class InviteFriends extends React.Component {
  state = {
    friendEmail: '',
    friends: [],

  };


  // email autocomplete if time allowed

  /* handleonChange(e){
   const value = e.target.value;
    //console.log("onChange:" + value);
    this.setState({
      friendEmail: value, // eslint-disable-line react/no-unused-state

    });
  } */


  componentDidMount() {
    this.loadFriends();
  }


  handleChange = prop => (event) => {
    // console.log("friends:"+event.target.value);

    this.setState({ [prop]: event.target.value });
  };


  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  handleInvitefriend = () => {
    Api.inviteFriend(this.props.orderId, this.state.friendEmail).then(() => {
      Snackbar.success('Successfully Inviting friends');
    }).catch((err) => {
      throw (err);
    });
  }

  loadFriends() {
    Api.friendList().then((res) => {
      this.setState({

        friends: res.data.length > 0 ? res.data : null,

      });
    }).catch((err) => {
      throw (err);
    });
  }

  inviteClick(e, email) {
    // const key = e.target;
    // console.log(`inviteClick: ${email}`);
    Api.inviteFriend(this.props.orderId, email).then(() => {
      Snackbar.success('Successfully Inviting friends');
    }).catch((err) => {
      throw (err);
    });
  }


  render() {
    const { classes } = this.props;
    const { friends } = this.state;

    return (
      <Card>
        <InputLabel htmlFor="email">Inviting by email!</InputLabel>
        <Input
          id="email"
          name="email"
          label="Invite Friends by email"
          className={classes.textarea}
          onChange={this.handleChange('friendEmail')}
          value={this.state.friendEmail}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton

                aria-haspopup="true"
                className={classes.accountButton}
                color="inherit"
                onClick={this.handleInvitefriend}
              >
                <AddCircle />
              </IconButton>
            </InputAdornment>
)}
        />

        {friends === null
          ? (
            <div>
              No friends in your Friends lists!
            </div>
          ) : [
            friends.map(friend => (

              <ListItem
                button
                key={friend.email} // eslint-disable-line react/no-array-index-key
                className={classes.item}
                onClick={event => this.inviteClick(event, friend.email)}
              >
                <div className={classes.itemLine}>
                  <ListItemText
                    primary={friend.name}

                  />
                  <ListItemText
                    className={classes.setstatus}
                    primary={friend.email}

                  />
                </div>
              </ListItem>

            )),
          ]


        }

      </Card>
    );
  }
}

InviteFriends.propTypes = {
  classes: PropTypes.object.isRequired,
  orderId: PropTypes.object.isRequired,
};


export default withStyles(styles)(InviteFriends);
