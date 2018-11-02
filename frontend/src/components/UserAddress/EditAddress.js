import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import States from '../../Statesfile';
import Paper from '@material-ui/core/Paper';
import Button from '../../material-kit/components/CustomButtons/Button';
import IconButton from '@material-ui/core/IconButton';

import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';

import axios from 'axios';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';
import Avatar from '@material-ui/core/Avatar';
//import iconn from './edit.svg';
import Icon from '@material-ui/core/Icon';

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
    margin: theme.spacing.unit,
  },
  buttonright: {
    marginLeft: theme.spacing.unit*28,
    marginRight: theme.spacing.unit*2,

  },
  dense: {
    marginTop: 12,
    marginRight: 10
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  bigAvatar: {
    width: 30,
    height: 30,
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


class EditAddress extends React.Component{
constructor(props){
  super(props);
  this.state = {
    id:"",
    name: "username",
    phone: "",
    line_1: "",
    line_2: "",
    city: "",
    state: "",
    zip_code: "",
    place_id: "",
    is_default: false,
  };

  this.handleConfirm = this.handleConfirm.bind(this);
  this.handleline_2 = this.handleline_2.bind(this);
  this.handleline_1 = this.handleline_1.bind(this);
  this.handleCity = this.handleCity.bind(this);
  this.handleState = this.handleState.bind(this);
  this.handleCountry = this.handleCountry.bind(this);
  this.handleZipcode = this.handleZipcode.bind(this);
  this.handlePhone = this.handlePhone.bind(this);
  this.handlename = this.handlename.bind(this);

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

  handleline_1 (event) {
    this.setState({ line_1: event.target.value });
  };

  handleline_2 (event) {
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
  handlename (event) {
    this.setState({ name: event.target.value });
  };


  handleConfirm(modal,event){
    const { name, phone, line_1, line_2, city, state, zip_code, place_id, is_default } = this.state;
    const { handleAddAddress } = this.props;
    const x = [];
    x[modal] = true;
    this.setState(x);
    alert(name+phone+line_1+line_2+city+state+zip_code);

    axios.put(apiList.updateaddress,this.state.id, {

      name: name,
      phone: phone,
      line_1: line_1,
      line_2: line_2,
      city: city,
      state: state,
      zip_code: zip_code,
      is_default: is_default,

    }).then(res => {
      console.log(res);
    //  handleAddAddress(res);

    }).catch(err => {
      console.log(err);
      const { response } = err;
      if (response && response.status === 401) {
        alert('authentification required');
      }
      else if (response && response.status === 422) {
        alert('Validaiton failed');
      }
      else {
        alert('other erro');
      }

    })

  }

  componentDidMount() {
    this.setState({id:this.props.id,phone:this.props.phone,line_1:this.props.line_1,line_2:this.props.line_2
                    ,city:this.props.city,state:this.props.state,zip_code:this.props.zip_code});
  }

    render(){
      const{classes} = this.props;

      return(
        <div>
        <IconButton variant="fab"  aria-label="Edit" className={classes.button} onClick={() => this.handleClickOpen('modal')}>
        <Icon>edit_icon</Icon>
        </IconButton>
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

          <form className={classes.container} noValidate autoComplete="off">
            <TextField
            required
            id="outlined-dense"
            label="Name the address"
            value={this.state.name}
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            onChange={this.handlename}
            />
            <TextField
            required
            id="outlined-dense"
            label="Street Address"
            value={this.state.line_1}

            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            fullWidth
            variant="outlined"
            onChange={this.handleline_1}
            />
            <TextField
              required
              id="outlined-dense"
              label="Apt #"
              value={this.state.line_2}

              className={classNames(classes.textField, classes.dense)}
              margin="dense"
              variant="outlined"
              onChange={this.handleline_2}
            />
            <TextField
              required
              id="outlined-dense"
              label="City"
              value={this.state.city}

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

              onChange={this.handleState(this.state)}
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

              value={this.state.zip_code}
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

              value={this.state.phone}
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
EditAddress.propTypes = {
  classes: PropTypes.object.isRequired,
  phone:PropTypes.string.isRequired,
  line_1:PropTypes.string,
  line_2:PropTypes.string,
  city:PropTypes.string,
  state:PropTypes.string,
  zip_code:PropTypes.string,
};

export default withStyles(styles)(EditAddress);
