import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },

});

class NameSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    const { handleNameChange } = this.props;
    this.setState({ name: value });
    handleNameChange(value);
  }

  render() {
    const { classes } = this.props;
    return (
      <TextField
        id="standard-with-placeholder"
        label="name"
        placeholder="name"
        className={classes.textField}
        margin="normal"
        onChange={this.handleChange}
      />
    );
  }
}
NameSearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};
export default withStyles(styles)(NameSearchBar);
