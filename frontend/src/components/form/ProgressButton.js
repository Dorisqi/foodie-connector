import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import classnames from 'classnames';

const styles = () => ({
  progressButton: {
    position: 'relative',
  },
  buttonProgress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  fullWidth: {
    width: '100%',
  },
});

class ProgressButton extends React.Component {
  render() {
    const {
      classes, children, loading, fullWidth, className, disabled, ...rest
    } = this.props;
    return (
      <div
        className={classnames([
          classes.progressButton,
          fullWidth ? classes.fullWidth : null,
          className,
        ])}
      >
        <Button
          {...rest}
          disabled={disabled || loading}
          fullWidth={fullWidth}
        >
          {children}
        </Button>
        {loading
          && (
          <div className={classes.buttonProgress}>
            <CircularProgress size={24} />
          </div>
          )
        }
      </div>
    );
  }
}

ProgressButton.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array,
  ]).isRequired,
  loading: PropTypes.bool.isRequired,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

ProgressButton.defaultProps = {
  fullWidth: false,
  className: null,
  disabled: false,
};

export default withStyles(styles)(ProgressButton);
