import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import './RestaurantCard.css';

const RestaurantCard = (props) => {
  const { item } = props;
  const labels = {
    distance: `${item.distance} mile`,
    time: `${item.estimate_time_lo} - ${item.estimate_time_hi} mins`,
    fee: `$${item.delivery_fee} Fee`,
    minimum: `$${item.order_minimum} Minimum`,
  };

  return (
    <Card className={item.name}>
      <CardActionArea>
        <CardContent>
          <CardMedia
            component="img"
            image={item.image}
            title={item.name}
          />
          <Typography gutterBottom variant="headline" component="h2" align="left">
            {item.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardContent>
        <Chip label={labels.distance} />
        <Chip label={labels.time} />
        <Chip label={labels.fee} />
        <Chip label={labels.minimum} />
      </CardContent>
    </Card>);
};

RestaurantCard.propTypes = {
  item: PropTypes.shape({}).isRequired,
};

export default RestaurantCard;
