import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

function setTwoDecimal(num) {
  return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
});

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: props.cartItems,
    };
    this.deleteItem = this.deleteItem.bind(this);

  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        cartItems: nextProps.cartItems
      })
  }

  deleteItem(name) {
    const { updateCart } = this.props;

    this.setState((state) => {
      const cartItems = state.cartItems.map(item => {
        if (item.name != name) {
          return item;
        }
        item.count--;
        return item;
      }).filter(item => item.count > 0);
      updateCart(cartItems);
      return { cartItems: cartItems };
    })
  }

  render() {
    const { classes } = this.props;
    const { cartItems } = this.state;
    var totalCost = 0;
    cartItems.forEach(item => totalCost += item.count*item.price);
    totalCost = setTwoDecimal(totalCost);
    const listItems = cartItems.map(item => {
      const primary = item.name+" X "+item.count;
      const secondary = setTwoDecimal(item.price*item.count);
      return (
        <ListItem>
          <ListItemText
            primary={primary}
            secondary={secondary}
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete" onClick={(e) => this.deleteItem(item.name)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
    )});

    return (
      <Grid item xs={12} md={3}>
          <Typography variant="h1" component="h1" align="center" className={classes.title}>
            Cart
          </Typography>
          <List>
            {listItems}
          </List>
          <Typography variant="h5">
            Total Cost: ${totalCost}
          </Typography>
      </Grid>
    )
  }
}

Cart.propTypes = {
  cartItems: PropTypes.shape({}).isRequired,
};
export default withStyles(styles)(Cart);
