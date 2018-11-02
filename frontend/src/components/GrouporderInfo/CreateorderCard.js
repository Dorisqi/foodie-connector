import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import CreateorderButton from './CreateorderButton';
import DeliveryaddrSelect from './DeliveryaddrSelect';

const styles = {
  card: {
    minWidth:330,
    maxWidth: 350,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

class CreateorderCard extends React.Component {
  state = {
    address_id: 10,
    restaurant_id:1,

  };


  render(){
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    return (
      <Card className={classes.card}>
        <CardContent>

          <DeliveryaddrSelect></DeliveryaddrSelect>

          <CreateorderButton delivery_address_id={this.state.address_id} restaurant_id={this.props.restaurant_id} >
          </CreateorderButton>

          </CardContent>
      </Card>
    );
  }

}

CreateorderCard.propTypes = {
  classes: PropTypes.object.isRequired,
  restaurant_id:PropTypes.string,
};

export default withStyles(styles)(CreateorderCard);
