import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
});

class FormErrorMessages extends React.Component {
  static defaultProps = {
    errors: null,
  };

  render() {
    const {
      errors,
      classes,
    } = this.props;

    return errors !== null && (
      <div className={classes.margin}>
        {errors !== null && errors.map((error, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Typography key={index} color="error" variant="body1" component="p">
            {error}
          </Typography>
        ))}
      </div>
    );
  }
}

FormErrorMessages.propTypes = {
  errors: PropTypes.array,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormErrorMessages);
