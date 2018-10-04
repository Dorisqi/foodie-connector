import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import States from '../../Statesfile';
import Paper from '@material-ui/core/Paper';
import Button from '../../material-kit/components/CustomButtons/Button';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';

import axios from 'axios';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,
  },
  button: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,
  },
  buttonright: {
    marginLeft: theme.spacing.unit*28,
    marginRight: theme.spacing.unit*2,

  },
  dense: {
    marginTop: 12,
    marginRight: 10
  },
  adjustinput: {
    marginTop: 12,
    marginLeft: theme.spacing.unit*6
  },
  menu: {
    width: 200,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    minHeight:300,
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 7,
    paddingBottom: theme.spacing.unit * 2,
    alignItems: 'center',
    justify: "center",
    padding:1*1,
    marginTop: theme.spacing.unit * 7,
    margin: '10px auto 0 auto',


  }
});


class AddingAddress extends React.Component{
constructor(props){
  super(props);
  this.state = {
    name: "username",
    phone: "",
    line_1: "",
    line_2: "",
    city: "",
    state: "",
    zip_code: "",
    place_id: "ChIJO_0IEK_iEogR4GrIyYopzz8",
    is_default: false,
  };

  this.handleConfirm = this.handleConfirm.bind(this);
  this.line_1 = this.line_1.bind(this);
  this.line_2 = this.line_2.bind(this);
  this.handleCity = this.handleCity.bind(this);
  this.handleState = this.handleState.bind(this);
  this.handleCountry = this.handleCountry.bind(this);
  this.handleZipcode = this.handleZipcode.bind(this);
  this.handlePhone = this.handlePhone.bind(this);
}

  componentDidMount() {
      this.forceUpdate();
  }
  handleClickOpen(modal) {
    const x = [];
    x[modal] = true;
    this.setState(x);
  }

  handleClose(modal) {
    const x = [];
    x[modal] = false;
    this.setState(x);
  }

  line_1 (event) {
    this.setState({ line_1: event.target.value });
  };

  line_2 (event) {
    this.setState({ line_2: event.target.value });
  };

  handleCity (event) {
    this.setState({ city: event.target.value });
  };
  handleState (name) {
    return event => {
      this.setState({ state: event.target.value });
    }
  };
  handleZipcode (event) {
    this.setState({ zip_code: event.target.value });
  };
  handleCountry (event) {
    this.setState({ country: event.target.value });
  };
  handlePhone (event) {
    this.setState({ phone: event.target.value });
  };

  handleConfirm(modal){
    const { name, phone, line_1, line_2, city, state, zip_code, place_id, is_default } = this.state;
    const { handleAddAddress } = this.props;
    axios.post(apiList.addressDetail, {
      name: name,
      phone: phone,
      line_1: line_1,
      line_2: line_2,
      city: city,
      state: state,
      zip_code: zip_code,
      place_id: place_id,
      is_default: is_default
    }).then(res => {
      console.log(res);
      handleAddAddress(res);
      const x = [];
      x[modal] = false;
      this.setState(x);
    }).catch(err => {
      console.log(err);
    })

  }

    render(){
      const{classes} = this.props;
      return(
        <div>
          <Button
            color="primary"
            round
            onClick={() => this.handleClickOpen('modal')}
          >
            ADD+
          </Button>
          <Dialog
            classes={{
              root: classes.center,
              paper: classes.modal,
            }}
            open={this.state.modal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.handleClose('modal')}
            aria-labelledby="modal-slide-title"
            aria-describedby="modal-slide-description"
          >
            <DialogContent
              id="modal-slide-description"
              className={classes.modalBody}
            >

          <Button className={classes.button}
           color="info">
           User Current Location
           </Button>

          <form className={classes.container} noValidate autoComplete="off">
            <TextField
            required
            id="outlined-dense"
            label="Street Address"
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            fullWidth
            variant="outlined"
            onChange={this.line_1}
            />
            <TextField
              required
              id="outlined-dense"
              label="Apt #"
              className={classNames(classes.textField, classes.dense)}
              margin="dense"
              variant="outlined"
              onChange={this.line_2}
            />
            <TextField
              required
              id="outlined-dense"
              label="City"
              className={classNames(classes.textField, classes.dense)}
              margin="dense"
              variant="outlined"
              onChange={this.handleCity}
            />
            <TextField
              id="selectStates"
              select
              label="state"
              className={classes.textField}
              value={this.state.state}
              onChange={this.handleState('State')}
              SelectProps={{
              native: true,
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="dense"
            variant="outlined"
            >
            {States.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            </TextField>
            <TextField
              required
              id="outlined-dense"
              label="Zipcode"
              className={classNames(classes.textField, classes.adjustinput)}
              margin="dense"
              variant="outlined"
              onChange={this.handleZipcode}
            />
            <TextField
              required
              id="outlined-dense"
              label="US"
              disabled
              className={classNames(classes.textField, classes.dense)}
              margin="dense"
              variant="outlined"
              onChange={this.handleCountry}
            />
            <TextField
              required
              id="outlined-dense"
              label="Phone Number"
              className={classNames(classes.textField, classes.dense)}
              margin="dense"
              variant="outlined"
              onChange={this.handlePhone}
            />


          </form>
          </DialogContent>
          <DialogActions
            className={`${classes.modalFooter} ${classes.modalFooterCenter}`}
          >

            <Button
              onClick={() => this.handleConfirm('modal')}
              color="primary"
            >
              confirm changing
            </Button>
            <Button
              onClick={() => this.handleClose('modal')}
              color="rose"
            >
              Cancle
            </Button>
          </DialogActions>
        </Dialog>
        </div>




      );
    }


}

AddingAddress.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddingAddress);
