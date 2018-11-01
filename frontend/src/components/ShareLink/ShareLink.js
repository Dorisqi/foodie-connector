import React from 'react';
// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

// @material-ui/icons

// core components
import Button from '../../material-kit/components/CustomButtons/Button';
import modalStyle from '../../material-kit/assets/jss/material-kit-react/modalStyle';

import axios from 'axios';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class ShareLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        share_link: '',
        isClickable:false,
    };
      //hand all changes
      this.handleShareOpen = this.handleShareOpen.bind(this);
      this.handleShareClose = this.handleShareClose.bind(this);
  }

  handleShareOpen(modal) {
    const x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleShareClose(modal) {
    const x =[];
    x[modal] = false;
    this.setState(x);
  }

  render() {
    const { classes } = this.props;
    return (
        <main>
          <Button onClick={() => this.handleShareOpen('modal')}
            round
            color="primary"
            size="small"
          >
            Share Order
          </Button>
          <Dialog
            classes={{
              root: classes.center,
              paper: classes.modal,
            }}
            open={this.state.modal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.handleShareClose('modal')}
            aria-labelledby="modal-slide-title"
            aria-describedby="modal-slide-description"
          >
            <DialogContent
              id="modal-slide-description"
              className={classes.modalBody}
            >
              <FormControl margin="normal" required fullWidth>
                <TextField
                  disabled
                  id="filled-disabled"
                  label="url"
                  defaultValue={this.state.share_link}
                  className={classes.textField}
                  margin="normal"
                  variant="filled"
                />
              </FormControl>
            </DialogContent>
            <DialogActions
              className={`${classes.modalFooter} ${classes.modalFooterCenter}`}
            >
              <Button
                color="secondary"
                round
                onClick={() => this.handleShareClose('modal')}
              >
              Ok
              </Button>
            </DialogActions>
          </Dialog>
        </main>
    );
  }
}
export default withStyles(modalStyle)(ShareLink);
