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
    width:'100'
  }
});

class InviteGroupmember extends React.Component {
  state = {
    email:'',
    errors: {},
  };

  constructor(props) {
    super(props);

    const { item: email } = props;
    if (email !== null) {
      this.state = {
        email:email,
        errors: {},
      };
    }
  }

  //email autocomplete if time allowed

  handleonChange = e => {
    const value = e.target.value;
    this.setState({
      email: value, // eslint-disable-line react/no-unused-state

    });
  }
  adding = () => {
    this.setState({
      errors: {},
    });
    const {
      email
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


  render() {
    const { classes, item: email } = this.props;
    const { errors, curemail } = this.state;

    return (
      <DialogForm
        title='Friends'
        submitLabel='Close'
        formErrors={errors.form}
        api={this.adding}
        className={classes.root}
        onRequestSucceed={this.handleRequestSuccess}
        onRequestFailed={this.handleRequestFail}
        onClose={this.props.onClose}
      >

        <InputTextField
          parent={this}
          name="email"
          label="Invite friends by Email "
          className={classes.textarea}

        />
        <IconButton

          aria-haspopup="true"
          className={classes.accountButton}
          color="inherit"
        >
          <PersonAdd />
        </IconButton>

        <List component="nav">
        <ListItem>
          <ListItemText primary="friends1" secondary="email"/>
        </ListItem>
        <Divider />
        <ListItem divider>
          <ListItemText primary="friend2" secondary="email"/>
        </ListItem>
        <ListItem >
          <ListItemText primary="friend3" secondary="email"/>
        </ListItem>
        <Divider light />
        <ListItem>
          <ListItemText primary="friend4" secondary="email"/>
        </ListItem>
      </List>

      </DialogForm>
    );
  }
}

InviteGroupmember.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
};

InviteGroupmember.defaultProps = {
  item: null,
};

export default withStyles(styles)(InviteGroupmember);
