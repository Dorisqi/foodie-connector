import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import ProgressButton from 'components/form/ProgressButton';
import Axios from 'facades/Axios';

const styles = () => ({
  itemActions: {
    paddingTop: 0,
    justifyContent: 'flex-end',
  },
  itemDelete: {
    color: red['500'],
  },
});

class ProfileItem extends React.Component {
  state = {
    updating: false,
    deletingAlert: false,
    deleting: null,
    settingDefault: null,
  };

  componentWillUnmount() {
    Axios.cancelRequest(this.state.deleting);
    Axios.cancelRequest(this.state.settingDefault);
  }

  handleDialogClose = () => {
    this.setState({
      updating: false,
    });
  };

  handleItemClick = () => {
    this.setState({
      updating: true,
    });
  };

  handleItemDeleteClick = () => {
    this.setState({
      deletingAlert: true,
    });
  };

  handleItemDelete = () => {
    if (this.state.deleting !== null) {
      return;
    }
    const { deleteApi, onUpdate } = this.props;
    this.setState({
      deleting: deleteApi().then((res) => {
        this.setState({
          deleting: null,
          deletingAlert: false,
        });
        onUpdate(res);
      }).catch((err) => {
        this.setState({
          deleting: null,
        });
        throw err;
      }),
    });
  };

  handleDeletingAlertClose = () => {
    this.setState({
      deletingAlert: false,
    });
  };

  handleItemSetDefault = () => {
    if (this.state.settingDefault !== null) {
      return;
    }
    const { setDefaultApi, onUpdate } = this.props;
    this.setState({
      settingDefault: setDefaultApi().then((res) => {
        this.setState({
          settingDefault: null,
        });
        onUpdate(res);
      }).catch((err) => {
        this.setState({
          settingDefault: null,
        });
        throw err;
      }),
    });
  };

  render() {
    const {
      classes,
      item,
      type,
      alias,
      onUpdate,
      children,
      updatingDialog: UpdatingDialog,
    } = this.props;
    const {
      updating, deletingAlert, deleting, settingDefault,
    } = this.state;
    return (
      <div>
        {updating
        && (
        <UpdatingDialog
          onClose={this.handleDialogClose}
          onUpdate={onUpdate}
          item={item}
        />
        )
        }
        <Dialog
          open={deletingAlert}
          onClose={this.handleDeletingAlertClose}
          aria-labelledby="deleting-alert-title"
          aria-describedby="deleting-alert-description"
        >
          <DialogTitle id="deleting-alert-title">
            Delete
            {' '}
            {type}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-alert-description">
              {`Do you really want to delete the ${type} ${alias}?`}
              The operation cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeletingAlertClose}>
              Cancel
            </Button>
            <ProgressButton
              className={classes.itemDelete}
              loading={deleting !== null}
              onClick={this.handleItemDelete}
            >
              Delete
            </ProgressButton>
          </DialogActions>
        </Dialog>
        <ListItem button onClick={this.handleItemClick}>
          {children}
        </ListItem>
        <ListItem className={classes.itemActions}>
          {item.is_default
            ? <Button disabled size="small">Default</Button>
            : (
              <ProgressButton
                size="small"
                loading={settingDefault !== null}
                onClick={this.handleItemSetDefault}
              >
                Set as default
              </ProgressButton>
            )
          }
          <Button
            className={classes.itemDelete}
            size="small"
            onClick={this.handleItemDeleteClick}
          >
            Delete
          </Button>
        </ListItem>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  alias: PropTypes.string.isRequired,
  deleteApi: PropTypes.func.isRequired,
  setDefaultApi: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  updatingDialog: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array,
  ]).isRequired,
};

export default withStyles(styles)(ProfileItem);
