import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  switchButton: {
    marginBottom: theme.spacing.unit / 2,
    marginTop: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit,
  },
});

class SwitchButton extends React.Component {
  handleButtonClick = (e) => {
    this.props.onClick(e);
  };

  render() {
    const { classes, active, label } = this.props;
    return (
      <Button
        className={classes.switchButton}
        color={active ? 'primary' : 'default'}
        size="small"
        variant="outlined"
        onClick={this.handleButtonClick}
      >
        {label}
      </Button>
    );
  }
}

SwitchButton.propTypes = {
  classes: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(SwitchButton);
