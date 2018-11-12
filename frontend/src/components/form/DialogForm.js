import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ProgressButton from 'components/form/ProgressButton';
import FormErrorMessages from 'components/form/FormErrorMessages';
import Axios from 'facades/Axios';

const styles = () => ({
  dialogPaper: {
    maxWidth: '95%',
    width: 600,
  },
  dialogContent: {
    paddingTop: '0 !important',
  },
});

class DialogForm extends React.Component {
  state = {
    open: true,
    requesting: null,
  };

  componentWillUnmount() {
    Axios.cancelRequest(this.state.requesting);
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleExited = () => {
    this.props.onClose();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      api,
      onRequestSucceed,
      onRequestFailed,
    } = this.props;
    if (this.state.requesting !== null) {
      return;
    }
    const promise = api();
    if (api === null) {
      return;
    }
    this.setState({
      requesting: promise.then((res) => {
        this.setState({
          open: false,
          requesting: null,
        });
        onRequestSucceed(res);
      }).catch((err) => {
        this.setState({
          requesting: null,
        });
        onRequestFailed(err);
      }),
    });
  };

  render() {
    const {
      classes, title, children, submitLabel, formErrors,
    } = this.props;
    const { open, requesting } = this.state;
    return (
      <Dialog
        classes={{
          paper: classes.dialogPaper,
        }}
        open={open}
        onClose={this.handleClose}
        onExited={this.handleExited}
        aria-labelledby="dialog-form-title"
      >
        <DialogTitle id="dialog-form-title">
          {title}
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent className={classes.dialogContent}>
            <FormErrorMessages errors={formErrors} />
            {children}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <ProgressButton loading={requesting !== null} type="submit" color="primary">
              {submitLabel}
            </ProgressButton>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

DialogForm.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array,
  ]).isRequired,
  submitLabel: PropTypes.string.isRequired,
  formErrors: PropTypes.array,
  api: PropTypes.func.isRequired,
  onRequestSucceed: PropTypes.func.isRequired,
  onRequestFailed: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

DialogForm.defaultProps = {
  formErrors: null,
};

export default withStyles(styles)(DialogForm);
