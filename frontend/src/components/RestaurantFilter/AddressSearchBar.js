import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Geocode from 'react-geocode';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },

});

class AddressSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    const { address } = this.state;
    const { onSubmit } = this.props;
    Geocode.fromAddress(address)
    .then(
      res => {
        onSubmit(res.results[0].place_id);
      }
    , err => {
        console.log(err)
      }
    )
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({ address: event.target.value });
  }

  render() {
    const { classes } = this.props;
    const { address } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          id="standard-with-placeholder"
          label="Address"
          placeholder="Address"
          className={classes.textField}
          margin="normal"
          onChange={this.handleChange}
        />
        <Input type="submit" value="Submit"/>
      </form>
    );
  }
}
AddressSearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};
export default withStyles(styles)(AddressSearchBar);
