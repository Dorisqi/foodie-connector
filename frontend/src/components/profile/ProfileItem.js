import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ProgressButton from 'components/form/ProgressButton';
import Axios from 'facades/Axios';
import DialogDeleteAlert from 'components/alert/DialogDeleteAlert';

const styles = theme => ({
  itemActions: {
    paddingTop: 0,
    justifyContent: 'flex-end',
  },
  itemDelete: {
    color: theme.palette.error.main,
  },
});

class ProfileItem extends React.Component {
  state = {
    updating: false,
    deletingAlert: false,
    settingDefault: null,
  };

  componentWillUnmount() {
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
      deleteApi,
      onUpdate,
      children,
      updatingDialog: UpdatingDialog,
    } = this.props;
    const {
      updating, deletingAlert, settingDefault,
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
        <DialogDeleteAlert
          open={deletingAlert}
          title={`Delete ${type}?`}
          text={`Do you really want to delete the ${type} ${alias}?`}
          api={deleteApi}
          onUpdate={onUpdate}
          onClose={this.handleDeletingAlertClose}
        />
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
