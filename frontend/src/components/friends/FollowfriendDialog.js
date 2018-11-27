import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogForm from 'components/form/DialogForm';
import InputTextField from 'components/form/InputTextField';
import Maps from 'facades/Maps';
import Api from 'facades/Api';
import Snackbar from 'facades/Snackbar';
import Form from 'facades/Form';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import PersonAdd from '@material-ui/icons/PersonAdd';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';



const styles = theme => ({
  margin: {
    marginTop: theme.spacing.unit*3,
    marginBottom: theme.spacing.unit,
  },
  root: {
    //width: '100%',
    maxWidth: '100px',
    backgroundColor: theme.palette.background.paper,
  },
  textarea: {
    //maxWidth:'420px',
  },
  setstatus: {
    flexGrow: 0,
    paddingRight: 0,
    minWidth: 'fit-content',
  },
});

class FollowfriendDialog extends React.Component {
  state = {
    friendEmail:'',
    errors: {},
    friends:[],
    loadingfriends:null,
  };

  constructor(props) {
    super(props);

    const { item: email } = props;
    if (email !== null) {
      this.state = {
        friendEmail:email,
        errors: {},

      };
    }
  }

  //email autocomplete if time allowed

  handleonChange = e => {
    const value = e.target.value;
    this.setState({
      friendEmail: value, // eslint-disable-line react/no-unused-state

    });
  }




  adding = () => {
    this.setState({
      errors: {},
    });
    const {
      friendEmail
    } = this.state;
    const { item: address } = this.props;
    //// TODO: Axios.addingFriend
    //alert for the corresponding error, after Successfully adding,clear the input
    /*return address === null
      ? Api.addressAdd(placeId, line2, name, phone, isDefault)
      : Api.addressUpdate(address.id, placeId, line2, name, phone, isDefault);*/
  };

  handleRequestSuccess = (res) => {
    if (this.props.item === null) {
      Snackbar.success('Successfully follow new friend!');
    }
    this.props.onUpdate(res);
  };

  handleRequestFail = (err) => {
    Form.handleErrors(this)(err);
    //not sure about the error using
    if (this.state.errors.email !== undefined) {
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

  handleAddingfriend = (e) =>{
    this.setState({
      loadingfriends: Api.followNewFriend(this.state.friendEmail).then((res) => {
        const result = res.data;
        this.setState({
          loadingfriends: null,
          friends: res.data.length > 0 ? res.data[0].order_members : null,
        });
        if(this.state.friends !== null){
          console.log("loadfriends:" +this.state.friends[0].user.name);

        }


      }).catch((err) => {
        this.setState({
          loadingfriends: null,
        });
        throw (err);
      }),
    });

  }



  loadFriends() {
    this.setState({
      loadingfriends: Api.friendList().then((res) => {
        const result = res.data;
        this.setState({
          loadingfriends: null,
          friends: res.data.length > 0 ? res.data : null,

        });
        if(this.state.friends !== null){
          console.log("loadFriends:" +this.state.friends[0].name);

        }


      }).catch((err) => {
        this.setState({
          loadingfriends: null,
        });
        throw (err);
      }),
    });
  }

  componentDidMount() {
    this.loadFriends();
  }

  onClose = () => {
    
  };

  render() {
    const { classes, item: email } = this.props;
    const { errors,friends } = this.state;

    return (
      <DialogForm
        title='Friends'
        submitLabel='Close'
        formErrors={errors.form}
        api={this.adding}
        className={classes.root}
        onRequestSucceed={this.handleRequestSuccess}
        onRequestFailed={this.handleRequestFail}
        onClose={this.onClose}
      >

        <InputTextField
          parent={this}
          name="email"
          label="Follow new friend by Email "
          className={classes.textarea}
          onChange={this.handleonChange}
          endAdornment={
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
              }
        />




        {friends === null
          ?
          (
            <div>
              No following friends yet!  Follow friends now!
            </div>
          ) : [
            friends.map(friend => (

              <ListItem
                key={friend.user.name} // eslint-disable-line react/no-array-index-key
                className={classes.item}
              >
                <div className={classes.itemLine}>
                  <ListItemText
                  primary={friend.name}

                  />
                  <ListItemText
                    className={classes.setstatus}
                    primary={friend.friend_id}

                  />
                </div>
                </ListItem>

            ))
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
