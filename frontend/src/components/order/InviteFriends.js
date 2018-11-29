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
import AddCircle from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';



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
    minWidth:'500px',
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
    inviting:null
  };

  constructor(props) {
    super(props);

    const { item: email } = props;
    if (email !== null) {
      this.state = {
        friendEmail:email,
        friends:null,
        errors: {},

      };
    }
  }

  //email autocomplete if time allowed

  /*handleonChange(e){
   const value = e.target.value;
    //console.log("onChange:" + value);
    this.setState({
      friendEmail: value, // eslint-disable-line react/no-unused-state

    });
  }*/
  handleChange = prop => event => {
    //console.log("friends:"+event.target.value);

      this.setState({ [prop]: event.target.value });
    };


  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  handleInvitefriend = (e) =>{

    this.setState({
      inviting: Api.inviteFriend(this.props.orderId,this.state.friendEmail).then((res) => {
        const result = res.data;
        this.setState({
          inviting: null,

        });

      }).catch((err) => {
        this.setState({
          inviting: null,
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

  inviteClick(e,email){
    //const key = e.target;
    console.log("inviteClick: "+ email);
    this.setState({
      inviting: Api.inviteFriend(this.props.orderId,email).then((res) => {
        const result = res.data;
        this.setState({
          inviting:null,
        });

      }).catch((err) => {
        this.setState({
          inviting: null,
        });
        throw (err);
      }),
    });

  }

  componentDidMount() {
    this.loadFriends();
  }


  render() {
    const { classes } = this.props;
    const { errors,friends } = this.state;

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
          endAdornment={
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
              }
        />

        {friends === null
          ?
          (
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

            ))
          ]



        }

        </Card>
    );
  }
}

FollowfriendDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  orderId: PropTypes.object.isRequired,
};

FollowfriendDialog.defaultProps = {
  item: null,
};

export default withStyles(styles)(FollowfriendDialog);
