import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ProgressButton from 'components/form/ProgressButton';
import Axios from 'facades/Axios';

const styles = theme => ({
  deleteButton: {
    color: theme.palette.error.main,
  },
});

class DialogDeleteAlert extends React.Component {
  state = {
    deleting: null,
  };

  componentWillUnmount() {
    Axios.cancelRequest(this.state.deleting);
  }

  handleDelete = () => {
    if (this.state.deleting) {
      return;
    }
    const { api, onUpdate, onClose } = this.props;
    this.setState({
      deleting: api().then((res) => {
        this.setState({
          deleting: null,
        });
        onUpdate(res);
        onClose();
      }).catch((err) => {
        this.setState({
          deleting: null,
        });
        throw (err);
      }),
    });
  };

  render() {
    const {
      classes, open, title, text, buttonLabel, onClose,
    } = this.props;
    const { deleting } = this.state;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="deleting-alert-title"
        aria-describedby="deleting-alert-description"
      >
        <DialogTitle id="deleting-alert-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-alert-description">
            {text}
            {' '}
            The operation cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Close
          </Button>
          <ProgressButton
            className={classes.deleteButton}
            loading={deleting !== null}
            onClick={this.handleDelete}
          >
            {buttonLabel}
          </ProgressButton>
        </DialogActions>
      </Dialog>
    );
  }
}

DialogDeleteAlert.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string,
  api: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

DialogDeleteAlert.defaultProps = {
  buttonLabel: 'Delete',
};

export default withStyles(styles)(DialogDeleteAlert);
