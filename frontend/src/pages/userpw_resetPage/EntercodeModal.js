import React from 'react';
// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import FormControl from '@material-ui/core/FormControl';
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import Button from "../../material-kit/components/CustomButtons/Button";
import modalStyle from '../../material-kit/assets/jss/material-kit-react/modalStyle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class EntercodeModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }
  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
  }
  handleConfirm(modal) {
    /// TODO: if not matched, alert, otherwise, use under 3 lines.
    var x = [];
    x[modal] = false;
    this.setState(x);
  }
  render(){
    const { classes, isEnabled,changecolor } = this.props;
    return (
      <div>
        <Button
          disabled={!isEnabled}
          color="primary"
          onClick={() => this.handleClickOpen("modal")}>
          Send Code
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
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}>
            <IconButton
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => this.handleClose("modal")}>
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>Enter 8-digit Code:</h4>
          </DialogTitle>
          <DialogContent>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="code">8-digit code from email</InputLabel>
            <Input
              name="Code"
              type="text"
              id="Code"
              autoComplete="Code"
            />
          </FormControl>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter +" " +classes.modalFooterCenter}>
            <Button
              onClick={() => this.handleConfirm("modal")}
            >
              Confirm
            </Button>
            <Button
              onClick={() => this.handleClose("modal")}
              color="successNoBackground">
              Cancle
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(modalStyle)(EntercodeModal);
