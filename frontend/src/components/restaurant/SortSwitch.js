import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

const styles = theme => ({
  sortSwitch: {
    height: 32,
    marginBottom: theme.spacing.unit / 2,
    marginTop: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit,
    minHeight: 32,
  },
});

class SortSwitch extends React.Component {
  static defaultProps = {
    defaultDesc: false,
  }

  handleSortSwitchClick = (e) => {
    this.props.onClick(e);
  }

  render() {
    const {
      label, active, isDesc, defaultDesc, classes,
    } = this.props;
    return (
      <Button
        className={classes.sortSwitch}
        color={active ? 'primary' : 'default'}
        variant="outlined"
        size="small"
        onClick={this.handleSortSwitchClick}
      >
        {label}
        {(active && isDesc) || (!active && defaultDesc)
          ? <ArrowDropDown fontSize="small" />
          : <ArrowDropUp fontSize="small" />
        }
      </Button>
    );
  }
}

SortSwitch.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  isDesc: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  defaultDesc: PropTypes.bool,
};

export default withStyles(styles)(SortSwitch);
