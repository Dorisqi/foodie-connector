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

/*import axios from 'axios';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';*/

function Transition(props) {
  return <Slide direction="down" {...props} />;
}


const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 300,
    maxHeight: 40,
  },

})

class ShareViaQR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        qr_code_link: '',
        isClickable:false,
    };
      //hand all changes
      this.handleViaQR = this.handleViaQR.bind(this);
      this.handleViaQRClose = this.handleViaQRClose.bind(this);
  }

  handleViaQR(modal) {
    const x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleViaQRClose(modal) {
    const x =[];
    x[modal] = false;
    this.setState(x);
  }

  render() {
    const { classes, qr_code_link} = this.props;
    return (
        <main>
          <Button onClick={() => this.handleViaQR('modal')}
            round
            color="primary"
            size="small"
          >
            JOIN VIA QR
          </Button>
          <Dialog
            classes={{
              root: classes.center,
              paper: classes.modal,
            }}
            open={this.state.modal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.handleViaQRClose('modal')}
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
                  value={qr_code_link}
                  label="url"
                  defaultValue={this.state.qr_code_link}
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
                onClick={() => this.handleViaQRClose('modal')}
              >
              CLOSE
              </Button>
            </DialogActions>
          </Dialog>
        </main>
    );
  }
}
export default withStyles(styles)(ShareViaQR);
