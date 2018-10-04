import React from 'react';
// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';

// @material-ui/icons

// core components
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '../../material-kit/components/CustomButtons/Button';
import modalStyle from '../../material-kit/assets/jss/material-kit-react/modalStyle';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class ChangepwBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      oldpw: '',
      newpw1: '',
      newpw2: '',

    };
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
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

  handleConfirm(modal) {
    const { oldpw, newpw1, newpw2 } = this.state;
    if (oldpw === newpw1) {
      alert("new password and old password shouldn't be the same");
    } else if (newpw1 !== newpw2) {
      alert('please check and match new password!');
    } else {
      alert('Success');
      this.setState({ oldpw: '', newpw1: '', newpw2: '' });
      const x = [];
      x[modal] = false;
      this.setState(x);
    }


    // alert(`${'Success: ' + '('}${this.state.oldpw} ${this.state.newpw1} ${this.state.newpw2}`);
  }

  handleChange1(event) {
    event.preventDefault();
    this.setState({ oldpw: event.target.value });
  }

  handleChange2(event) {
    event.preventDefault();
    this.setState({ newpw1: event.target.value });
  }

  handleChange3(event) {
    event.preventDefault();
    this.setState({ newpw2: event.target.value });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          color="info"
          round
          onClick={() => this.handleClickOpen('modal')}
        >
          Change  Password
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
            <h3>please enter the old password and the new password!</h3>
            <h4 id="alert" />
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

export default withStyles(modalStyle)(ChangepwBox);
