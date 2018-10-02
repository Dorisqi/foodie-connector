import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import States from '../../Statesfile';
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});


class AddingAddress extends React.Component{
  state = {
    Address1: "",
    Address2: "",
    City: "",
    State: "",
    Country: "",
    Zipcode: "",
  };


  componentDidMount() {
      this.forceUpdate();
    }

  handleChangeadd1 = event => {
      this.setState({ Address1: event.target.value });
  };

  handleChangeadd2 = event => {
        this.setState({ Address2: event.target.value });
  };

  handleState = name => event => {
        this.setState({ State: event.target.value });
  };
  handleZip = event => {
        this.setState({ Zipcode: event.target.value });
    };

    render(){
      const{classes} = this.props;
      return(
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            required
            id="outlined-dense"
            label="Street Address"
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
          />
          <TextField
            required
            id="outlined-dense"
            label="Apt #"
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
          />
          <TextField
            required
            id="outlined-dense"
            label="City"
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
          />
          <TextField
          id="selectStates"
          select
          label="States"
          className={classes.textField}
          value={this.state.State}
          onChange={this.handleState('State')}
          SelectProps={{
            native: true,
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="dense"
          variant="outlined"
        >
          {States.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
          <TextField
            required
            id="outlined-dense"
            label="Zipcode"
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
          />



        </form>





      );
    }


}

AddingAddress.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddingAddress);
