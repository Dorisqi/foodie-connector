import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import StarRate from '@material-ui/icons/StarRate';
import { Link } from 'react-router-dom';

const styles = theme => ({
  imageWrapper: {
    position: 'relative',
  },
  image: {
    paddingTop: '50%',
  },
  closedShade: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  closedShadeText: {
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
    width: '100%',
  },
  cardContent: {
    padding: '10px 15px',
  },
  nameCategory: {
    minHeight: 90,
  },
  chips: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    height: 25,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class RestaurantListItem extends React.Component {
  render() {
    const { restaurant, classes } = this.props;
    const {
      id,
      image,
      name,
      restaurant_categories: restaurantCategories,
      distance,
      rating,
      estimated_delivery_time: estimatedDeliveryTime,
      delivery_fee: deliveryFee,
      order_minimum: orderMinimum,
      is_open: isOpen,
    } = restaurant;
    return (
      <Card>
        <CardActionArea component={Link} to={`/restaurants/${id}`}>
          <div className={classes.imageWrapper}>
            <CardMedia
              image={image}
              title={name}
              className={classes.image}
            />
            {!isOpen
              && (
              <div className={classes.closedShade}>
                <Typography
                  className={classes.closedShadeText}
                  variant="h5"
                  component="span"
                >
                  CURRENTLY CLOSED
                </Typography>
              </div>
              )
            }
          </div>
          <CardContent className={classes.cardContent}>
            <div className={classes.nameCategory}>
              <Typography variant="h6" component="h2">
                {name}
              </Typography>
              <Typography color="textSecondary">
                {restaurantCategories.slice(0, 3).map(category => category.name).join(',')}
              </Typography>
            </div>
            <div className={classes.chips}>
              {rating !== null
                && (
                <Chip
                  icon={<StarRate />}
                  label={`${rating}`}
                  className={classes.chip}
                />
                )
              }
              <Chip label={`${distance}km`} className={classes.chip} />
              <Chip label={`${estimatedDeliveryTime}mins`} className={classes.chip} />
              <Chip
                label={deliveryFee > 0 ? `$${deliveryFee} fee` : 'free delivery'}
                className={classes.chip}
              />
              <Chip
                label={orderMinimum > 0 ? `$${orderMinimum} minimum` : 'no order minimum'}
                className={classes.chip}
              />
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

RestaurantListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  restaurant: PropTypes.object.isRequired,
};

export default withStyles(styles)(RestaurantListItem);
