import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import apiList from '../../apiList';

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    //margin: theme.spacing.unit,
    minWidth: 240,
  },
});

class DeliveryaddrSelect extends React.Component {
  state = {
    selectedaddr: '',
    user_address_id:0,
    address:[],
    open: false,
  };

  handleChange = event => {
    const {value} = event.target;
    this.setState({ [event.target.name]: event.target.value, });
    this.setState({ user_address_id: value});
    //alert("Delivery id" + value);
    this.props.liftaddressId(value);

  };

  handleClose = () => {
    this.setState({ open: false });
    //alert(this.state.user_address_id);
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  loadAddresses() {
    axios.get(apiList.addresses)
    .then(res => this.setState({ address: res.data }))
    .catch(err => {
      const { response } = err;
      if (response && response.status === 401) {
        console.log('not authenticated');
      }
      else {
        console.log(err);
      }
    });
  }


  componentDidMount() {
    console.log('load addresses');
    //alert('load address');
    this.loadAddresses();
  }

  render() {
    const { classes } = this.props;

    return (
      <form autoComplete="off">

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="demo-controlled-open-select">Choosing Delivery Address</InputLabel>
          <Select
            open={this.state.open}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            value={this.state.selectedaddr}
            onChange={this.handleChange}
            inputProps={{
              name: 'selectedaddr',
              index:'user_address_id',
              id: 'demo-controlled-open-select',
            }}
          >
            <MenuItem value="">
              <em>Undecided</em>
            </MenuItem>
            {this.state.address.map(address => (
              <MenuItem value={address.id}>{address.line_1+","+address.line_2+","+address.city}</MenuItem>

             ))}

          </Select>
        </FormControl>
      </form>
    );
  }
}

DeliveryaddrSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeliveryaddrSelect);
