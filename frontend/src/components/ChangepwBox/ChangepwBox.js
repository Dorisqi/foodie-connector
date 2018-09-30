import React from 'react';
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from '@material-ui/core/FormControl';
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import Button from "../../material-kit/components/CustomButtons/Button";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import modalStyle from "../../material-kit/assets/jss/material-kit-react/modalStyle";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class ChangepwBox extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      status: false,
      oldpw: '',
      newpw1: '',
      newpw2: ''

    };
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);

  }
  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);

  }
handleClose(modal){
  var x = [];
  x[modal] = false;
  this.setState(x);
}

  handleConfirm(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
    const checkold_new = this.state.oldpw === this.state.newpw1;
    checkold_new ? alert("new password and old password shouldn't be the same") : alert("newpassword ok");
    const match = this.state.newpw1 ===this.state.newpw2;
    match ? alert("matched") : alert("please match new password!")

     alert('Success: ' +'('+ this.state.oldpw + ' '+ this.state.newpw1 + ' '+ this.state.newpw2 +'');
  }

  handleChange1(event) {
    event.preventDefault();
   this.setState({oldpw: event.target.value});
 }
 handleChange2(event) {
   event.preventDefault();
  this.setState({newpw1: event.target.value});
}
handleChange3(event) {
  event.preventDefault();
 this.setState({newpw2: event.target.value});
}
  render(){
    const { classes } = this.props;
    return (
      <div>
        <Button
          color="primary"
          round
          onClick={() => this.handleClickOpen("modal")}>
          Change  Password
        </Button>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.modal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose("modal")}
          aria-labelledby="modal-slide-title"
          aria-describedby="modal-slide-description">
          <DialogContent
            id="modal-slide-description"
            className={classes.modalBody}>
            <h3>please enter the old password and the new password!</h3>
            <h4 id='alert'></h4>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Enter Old Password</InputLabel>
              <Input
                name="newpw"
                type="password"
                id="newpassword"
                value={this.state.oldpw}
                onChange={this.handleChange1}
                autoComplete="newpassword"
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Enter New Password</InputLabel>
              <Input
                name="newpw"
                type="password"
                id="newpassword"
                value={this.state.newpw1}
                onChange={this.handleChange2}
                autoComplete="newpassword"
              />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Enter New Password again</InputLabel>
              <Input
                name="newpw2"
                type="password"
                id="newpassword2"
                value={this.state.newpw2}
                onChange={this.handleChange3}
                autoComplete="newpassword2"
              />
            </FormControl>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter +" " +classes.modalFooterCenter}>

            <Button
              onClick={() => this.handleConfirm("modal")}
              color="primary"
            >
              confirm changing
            </Button>
            <Button
              onClick={() => this.handleClose("modal")}
              color="rose">
              Cancle
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(modalStyle)(ChangepwBox);
