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

class UseremailChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      newemail: '',
      newemail2: '',
      Current: '',
      flag: 0,

    };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
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

  handleChange1(event) {
    event.preventDefault();
    this.setState({ newemail: event.target.value });
  }

  handleChange2(event) {
    event.preventDefault();
    this.setState({ newemail2: event.target.value });
  }

  handleConfirm(modal) {
    const { newemail, newemail2 } = this.state;
    if (newemail !== newemail2) {
      alert('Email not Match! Please match two email');
    } else {
      alert('You will receive the email from us to verify Your new Email Address later. Thank you');
      this.setState({ Current: this.state.newemail, newemail: '', newemail2: '' });
      // Current = this.state.newemail;
      const x = [];
      x[modal] = false;
      this.setState(x);
    }


    // alert(`${'Success: ' + '('}${this.state.oldpw} ${this.state.newpw1} ${this.state.newpw2}`);
  }


  render() {
    const { classes, Current } = this.props;
    if (this.state.flag == 0) {
      this.state.Current = Current;
      this.state.flag = 1;
    }
    // this.state.Current = Current;
    return (
      <div>
        <Button
          color="info"
          round
          onClick={() => this.handleClickOpen('modal')}
        >
          Change Current Email Address:
          {' '}
          {this.state.Current}
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
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Please enter new Email Address</InputLabel>
              <Input
                name="newemail"
                type="text"
                id="newemail"
                value={this.state.newemail}
                onChange={this.handleChange1}
                autoComplete="newpassword"
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Please enter New Email Address again</InputLabel>
              <Input
                name="newemail2"
                type="text"
                id="newemail2"
                value={this.state.newemail2}
                onChange={this.handleChange2}
                autoComplete="newpassword"
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

export default withStyles(modalStyle)(UseremailChange);
