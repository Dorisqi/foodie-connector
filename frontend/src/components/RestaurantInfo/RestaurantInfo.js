import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class RestaurantInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantInfo: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.props.restaurantInfo).length === 0) {
      this.setState({
        restaurantInfo: nextProps.restaurantInfo
      })
    }
  }

  render() {
    const { restaurantInfo } = this.state;
    return (
      <Grid item xs md={9}>
        <Paper elevation={5}>
          <Typography variant="h1" component="h1" align="center">
            {restaurantInfo.name}
          </Typography>
        </Paper>
        <br/>
        <Paper elevation={5}>
          <CardMedia
            component="img"
            alt={restaurantInfo.name}
            height="210"
            image={restaurantInfo.image}
          />
        </Paper>
        <br/>
        <Paper elevation={5}>
          <Typography variant="body1" align="left">
            Categories:
          </Typography>
          <Typography variant="body1" align="left">
            {restaurantInfo.categories
              ? restaurantInfo.categories.join(', ')
              : ''
            }
          </Typography>
        </Paper>
        <br/>
        <Paper elevation={5}>
          <Typography variant="body1" align="left">
            Address:
          </Typography>
          <Typography variant="body1" align="left">
            {restaurantInfo.address_line_1}
          </Typography>
          {restaurantInfo.address_line_2 !== ""
            ?
            <Typography variant="body1" align="left">
              {restaurantInfo.address_line_2}
            </Typography>
            :
            null
          }
          <Typography variant="body1" align="left">
            {`${restaurantInfo.city}, ${restaurantInfo.state} ${restaurantInfo.zip_code}`}
          </Typography>
        </Paper>
        <br/>
        <Paper elevation={5}>
          <Typography variant="body1" align="left">
            {`Phone: ${restaurantInfo.phone}`}
          </Typography>
        </Paper>
        <br/>
        <Paper elevation={5}>
          <Typography variant="body1" align="left">
            {`Rate: ${restaurantInfo.rating? restaurantInfo.rating: ""}`}
          </Typography>
        </Paper>
        <br/>
        <Paper elevation={5}>
          <Typography variant="body1" align="left">
            {`Minumum to order: $${restaurantInfo.order_minimum}`}
          </Typography>
        </Paper>
        <br/>
        <Paper elevation={5}>
          <Typography variant="body1" align="left">
            {`Delivery fee: $${restaurantInfo.delivery_fee}`}
          </Typography>
        </Paper>
        <br/>
        <Paper elevation={5}>
          <Typography variant="body1" align="left">
            Operation Times:
          </Typography>
          {restaurantInfo.operation_times
            ? restaurantInfo.operation_times.map(d => (
                <Typography variant="body1" align="left">
                  {`${DAYS[+(d.day_of_week)]}: ${d.start_time.slice(0, -3)} - ${d.end_time.slice(0, -3)}`}
                </Typography>
              ))
            : null
          }
        </Paper>
      </Grid>
    );
  }
}

RestaurantInfo.propTypes = {
  restaurantInfo: PropTypes.shape({}).isRequired,
};
export default RestaurantInfo;
