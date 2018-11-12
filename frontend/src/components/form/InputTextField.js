import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Form from 'facades/Form';

const styles = theme => ({
  textField: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
});

class InputTextField extends React.Component {
  static defaultProps = {
    type: 'text',
    required: true,
    fullWidth: true,
  };

  render() {
    const {
      parent,
      name,
      type,
      label,
      fullWidth,
      required,
      classes,
      ...rest
    } = this.props;

    return (
      <TextField
        {...rest}
        id={name}
        type={type}
        label={label}
        className={classes.textField}
        value={parent.state[name]}
        onChange={Form.handleInputChange(parent, name)}
        error={parent.state.errors[name] !== undefined}
        helperText={parent.state.errors[name]}
        fullWidth={fullWidth}
        required={required}
      />
    );
  }
}

InputTextField.propTypes = {
  parent: PropTypes.instanceOf(React.Component).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputTextField);
