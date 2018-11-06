import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    lineHeight: '1.1875em',
  },
  left: {
    paddingTop: 6,
    paddingBottom: 7,
    width: 120,
  },
  right: {
    flexGrow: 1,
  },
});

class OptionListItem extends React.Component {
  render() {
    const { classes, children } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.left}>
          {children[0]}
        </div>
        <div className={classes.right}>
          {children[1]}
        </div>
      </div>
    )
  }
}

OptionListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
};

export default withStyles(styles)(OptionListItem);
