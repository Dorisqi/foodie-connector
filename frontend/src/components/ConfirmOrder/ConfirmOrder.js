import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import apiList from '../../apiList';
import axios from 'axios';


const styles = theme => ({
  submit: {
    marginTop: theme.spacing.unit * 3,
  },

});
class ConfirmOrde extends React.Component {
  constructor (props)
  {
    super(props);
    this.state = {
      creatorId: '',
    };
    //handlechanges
    this.handleConfirmOrder = this.handleConfirmOrder.bind(this);
  }

  handleConfirmOrder () {
    axios.get(apiList.profile).then(res => {
      console.log(res.data);
      this.setState({creatorId: res.data.id});
      console.log(this.state.creatorId);
    }).catch(err => {
      const {response} = err;
      if (response) {
        if (response.status === 401) {
            alert("This page requires authentication.");
            window.location.href ="/login"
        }
      }
    })

    axios.get(apiList.order).then(res => {
        console.log(res.data);
        if (res.data.creator.id == 21)
        {
          console.log(res.data);
          alert("it is the creator");
          window.location.href ="/checkout"
        }
        else {
          alert("only the creator can confirm the order");
        }
    }).catch(err=> {
      const { response } = err;
      if (response ) {
        if (response.status === 422)
        {
          alert("This page requires authentication.");
          window.location.href ="/login"
        }
      }
    })
  }
  render() {
    const { classes } = this.props;

    return (
      <main>
        <Button onClick = {this.handleConfirmOrder}
          variant = "raised"
          color = "primary"
          className = {classes.submit}
        >
          Confirm Order
        </Button>
      </main>

    );
  }
}
export default withStyles(styles)(ConfirmOrde);
