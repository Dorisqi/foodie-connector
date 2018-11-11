import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';
import Form from 'facades/Form';
import Snackbar from 'facades/Snackbar';
import Axios from 'facades/Axios';

const styles = () => ({
  loadingAdornment: {
    display: 'flex',
    justifyContent: 'center',
    width: 48,
  },
});

class InputForm extends React.Component {
  state = {
    value: '',
    editing: false,
    updating: null,
    error: null,
  };

  constructor(props) {
    super(props);

    this.state.value = this.props.value;
  }

  componentWillUnmount() {
    Axios.cancelRequest(this.state.updating);
  }

  handleEdit = () => {
    this.setState({
      editing: true,
    });
  };

  handleEditClose = () => {
    const { value } = this.props;
    this.setState({
      value,
      editing: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { value, editing, updating } = this.state;
    const {
      name, label, api, onChange,
    } = this.props;
    if (!editing || updating !== null) {
      return;
    }
    this.setState({
      updating: api(value).then((res) => {
        this.setState({
          updating: null,
          editing: false,
          error: null,
        });
        onChange(res.data);
        Snackbar.success(`Successfully update ${label.toLowerCase()}.`);
      }).catch((err) => {
        const state = {
          updating: null,
        };
        if (err.response.status === 422) {
          state.error = err.response.data.data[name][0];
          this.setState(state);
        } else {
          this.setState(state);
          throw err;
        }
      }),
      error: null,
    });
  };

  renderAdornment() {
    const { classes } = this.props;
    const { editing, updating } = this.state;
    if (editing) {
      if (updating) {
        return (
          <InputAdornment position="end" className={classes.loadingAdornment}>
            <CircularProgress size={20} />
          </InputAdornment>
        );
      }
      return (
        <InputAdornment position="end">
          <IconButton type="submit" size="small">
            <Check />
          </IconButton>
          <IconButton size="small" onClick={this.handleEditClose}>
            <Close />
          </IconButton>
        </InputAdornment>
      );
    }
    return (
      <InputAdornment position="end">
        <IconButton size="small" onClick={this.handleEdit}>
          <Edit />
        </IconButton>
      </InputAdornment>
    );
  }

  render() {
    const {
      name, label, ...rest
    } = this.props;
    const {
      value, editing, error,
    } = this.state;
    return (
      <form
        {...rest}
        onSubmit={this.handleSubmit}
      >
        <FormControl
          error={error !== null}
          fullWidth
        >
          <InputLabel htmlFor={`input-${name}`}>
            {label}
          </InputLabel>
          <Input
            id={`input-${name}`}
            value={value}
            onChange={Form.handleInputChange(this, 'value')}
            disabled={!editing}
            endAdornment={this.renderAdornment()}
          />
          {error !== null && (
            <FormHelperText>
              {error}
            </FormHelperText>
          )}
        </FormControl>
      </form>
    );
  }
}

InputForm.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  api: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(InputForm);
