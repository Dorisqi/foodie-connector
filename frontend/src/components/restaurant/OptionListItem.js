import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    lineHeight: '1.1875em',
  },
  label: {
    paddingTop: 6,
    paddingBottom: 7,
    minWidth: 120,
  },
  content: {
    flexGrow: 1,
  },
});

class OptionListItem extends React.Component {
  render() {
    const { classes, label, children } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="body1" className={classes.label} component="div">
          {label}
        </Typography>
        <div className={classes.content}>
          {children}
        </div>
      </div>
    );
  }
}

OptionListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]).isRequired,
};

export default withStyles(styles)(OptionListItem);
