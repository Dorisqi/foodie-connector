import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import DialogForm from 'components/form/DialogForm';
import Api from 'facades/Api';
import Snackbar from 'facades/Snackbar';
import Form from 'facades/Form';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAdd from '@material-ui/icons/PersonAdd';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import DialogDeleteAlert from 'components/alert/DialogDeleteAlert';


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
    minWidth: '420px',
  },
  setstatus: {
    flexGrow: 0,
    paddingRight: 0,
    minWidth: 'fit-content',
  },
  itemDelete: {
    color: theme.palette.error.main,
  },
});

class FollowfriendDialog extends React.Component {
  state = {
    friendEmail: '',
    errors: {},
    friends: [],
    loadingfriends: null,
    deletingAlert:false
  };

  constructor(props) {
    super(props);

    const { item: email } = props;
    if (email !== null) {
      this.state = {
        friendEmail: email,
        errors: {},

      };
    }
  }

  componentDidMount() {
    this.loadFriends();
  }

  handleChange = prop => (event) => {
    this.setState({ [prop]: event.target.value });
  };

  handleRequestSuccess = () => {
    if (this.props.item === null) {
      Snackbar.success('Successfully follow new friend!');
    }
  };

  handleRequestFail = (err) => {
    Form.handleErrors(this)(err);
    // not sure about the error using
    if (this.state.friendEmail !== undefined) {
      const { errors } = this.state;
      const newErrors = { ...errors };
      newErrors.address = 'The email is invalid.';
      this.setState({ errors: newErrors });
    }
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  handleAddingfriend = () => {
    // console.log(`friends:${this.state.friendEmail}`);
    Api.followNewFriend(this.state.friendEmail).then((res) => {
      Snackbar.success('Successfully follow a new friends');
      this.setState({
        loadingfriends: null,
        friends: res.data.length > 0 ? res.data : null,
      });
    }).catch((err) => {
      this.setState({
        loadingfriends: null,
      });
      Snackbar.error(' Following friend failed');

      throw (err);
    });
  }


  handledeleteClick=(e,friendid)=>{

    Api.unfollowFriend(friendid).then(() => {
      Snackbar.success('Successfully delete the friend');
      this.loadFriends();
    }).catch((err) => {
      throw (err);
    });


  }


  handleDeletingAlertClose = () => {
    this.setState({
      deletingAlert: false,
    });
  };


  loadFriends() {
    Api.friendList().then((res) => {
      this.setState({
        loadingfriends: null,
        friends: res.data.length > 0 ? res.data : null,

      });
      if (this.state.friends !== null) {
        //  console.log(`loadFriends:${this.state.friends[0].name}`);
      }
    }).catch((err) => {
      this.setState({
        loadingfriends: null,
      });
      throw (err);
    });
  }


  render() {
    const { classes } = this.props;
    const { errors, friends, loadingfriends } = this.state;

    return (
      <DialogForm
        title="Friends"
        formErrors={errors.form}
        className={classes.root}
        onRequestSucceed={this.handleRequestSuccess}
        onRequestFailed={this.handleRequestFail}
        onClose={this.props.onClose}
      >
        <InputLabel htmlFor="email">Follow new friend by Email! (click to unfollow Friend)</InputLabel>
        <Input
          id="email"
          parent={this}
          name="email"
          type="email"
          label="Follow new friend by Email "
          className={classes.textarea}
          onChange={this.handleChange('friendEmail')}
          value={this.state.friendEmail}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton

                aria-haspopup="true"
                className={classes.accountButton}
                color="inherit"
                onClick={this.handleAddingfriend}
              >
                <PersonAdd />
              </IconButton>
            </InputAdornment>
          )}
        />
        {loadingfriends && <LinearProgress />}
        {friends === null
          ? (
            <div>
              No following friends yet!  Follow friends now!
            </div>
          ) : [
            friends.map(friend => (

              <ListItem
                button
                key={friend.name} // eslint-disable-line react/no-array-index-key
                className={classes.item}
                onClick={event => this.handledeleteClick(event, friend.friend_id)}

              >
              <div className={classes.itemLine}>
                  <ListItemText
                    primary={friend.name}
                  />

                  <ListItemText
                    className={classes.setstatus}
                    secondary={friend.email}
                  />

                </div>
              </ListItem>



            )),
          ]
          }
      </DialogForm>
    );
  }
}

FollowfriendDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
};

FollowfriendDialog.defaultProps = {
  item: null,
};

export default withStyles(styles)(FollowfriendDialog);
