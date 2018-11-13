import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
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
    const error = parent.state.errors[name];
    return (
      <FormControl
        className={classes.textField}
        error={error !== undefined}
        required={required}
        fullWidth={fullWidth}
      >
        <InputLabel htmlFor={name}>
          {label}
        </InputLabel>
        <Input
          {...rest}
          id={name}
          type={type}
          value={parent.state[name]}
          onChange={Form.handleInputChange(parent, name)}
        />
        {error !== undefined && (
          <FormHelperText>
            {error}
          </FormHelperText>
        )}
      </FormControl>
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
