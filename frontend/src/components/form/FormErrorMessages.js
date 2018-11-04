import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';

const styles = theme => ({
  formError: {
    fontSize: '1rem',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  hidden: {
    display: 'none',
  },
});

class FormErrorMessages extends React.Component {
  static defaultProps = {
    fullWidth: true,
  };

  render() {
    const {
      errors,
      classes,
      fullWidth,
    } = this.props;

    return (
      <FormControl
        className={errors === undefined ? classes.hidden : classes.margin}
        fullWidth={fullWidth}
        error>
        {errors !== undefined && errors.map((error, index) => (
          <FormHelperText className={classes.formError} key={index} error>
            {error}
          </FormHelperText>
        ))}
      </FormControl>
    );
  }
}

FormErrorMessages.propTypes = {
  errors: PropTypes.array,
  fullWidth: PropTypes.bool,
};

export default withStyles(styles)(FormErrorMessages);
