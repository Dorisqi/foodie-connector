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
    Address1: "",
    Address2: "",
    City: "",
    State: "",
    Country: "",
    Zipcode: "",
    Phonenum: ""
  };

  this.handleConfirm = this.handleConfirm.bind(this);
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

  handleChangeadd1 = event => {
      this.setState({ Address1: event.target.value });
  };

  handleChangeadd2 = event => {
        this.setState({ Address2: event.target.value });
  };

  handleState = name => event => {
        this.setState({ State: event.target.value });
  };
  handleZip = event => {
        this.setState({ Zipcode: event.target.value });
    };
  handlePhonenum(event) {
        this.setState({ Phonenum: event.target.value });
  };
  handleConfirm(event){
      alert('Street:' + this.state.Address1 +' apt:' + this.state.Address2 +
            ' city:' + this.state.City + ' State:' + this.state.State + ' Country: US'
            +' Phonenumber:' + this.state.Phonenum);
      window.location = '/userprofile';

  }
  handleBack(event){

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

          <Button className={classes.button} focusRipple
            onClick={() => this.handleConfirm('modal')}
            color="rose"
          >
            Confirm
          </Button>

          <Button className={classes.button} focusRipple
            onClick={() => this.handleClose('modal')}
            color=""
          >
            Cancle
          </Button>
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
            />
            <TextField
              required
              id="outlined-dense"
              label="Apt #"
              className={classNames(classes.textField, classes.dense)}
              margin="dense"
              variant="outlined"
            />
            <TextField
              required
              id="outlined-dense"
              label="City"
              className={classNames(classes.textField, classes.dense)}
              margin="dense"
              variant="outlined"
            />
            <TextField
              id="selectStates"
              select
              label="States"
              className={classes.textField}
              value={this.state.State}
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
            />
            <TextField
              required
              id="outlined-dense"
              label="US"
              disabled
              className={classNames(classes.textField, classes.dense)}
              margin="dense"
              variant="outlined"
            />
            <TextField
              required
              id="outlined-dense"
              label="Phone Number"
              className={classNames(classes.textField, classes.dense)}
              margin="dense"
              variant="outlined"
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
