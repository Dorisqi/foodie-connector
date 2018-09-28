import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from 'components/CustomButtons/Button';
import GridItem from 'components/Grid/GridItem';
import './RestaurantCard.css';

const RestaurantCard = (props) => {
  const { item } = props;
  const tags = item.tags.join(', ');
  const labels = {
    distance: `${item.distance} mile`,
    time: `${item.estimate_time_lo} - ${item.estimate_time_hi} mins`,
    fee: `$${item.delivery_fee} Fee`,
    minimum: `$${item.order_minimum} Minimum`,
  };

  return (
    <GridItem>
      <Card className="card">
        <CardActionArea className="actionArea">
          <CardMedia
            className="resize"
            component="img"
            image={item.image}
            title={item.name}
          />
          <Typography gutterBottom>
            <h2 className="restaurantName">
              {item.name}
              <span className="rateText">
                {`${item.rate}%`}
              </span>
              <Icon className="thumbUp" fontSize="small" color="secondary">
              thumb_up
              </Icon>
            </h2>
            <p className="tags">{tags}</p>

          </Typography>

          <div className="labelList">
            <Button className="label" disableRipple disabled>
              {labels.distance}
            </Button>
            <Button className="label" disableRipple disabled>
              {labels.time}
            </Button>
            <Button className="label" disableRipple disabled>
              {labels.fee}
            </Button>
            <Button className="label" disableRipple disabled>
              {labels.minimum}
            </Button>
          </div>
        </CardActionArea>
      </Card>
    </GridItem>

  );
};

RestaurantCard.propTypes = {
  item: PropTypes.shape({}).isRequired,
};

export default RestaurantCard;
