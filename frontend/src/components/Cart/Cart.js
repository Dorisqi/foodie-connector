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
      restaurantName: "",
      cart: {
        "restaurant_id": null,
        "cart": [],
        "subtotal": 0,
      },
      menu: []
    };
    this.deleteItem = this.deleteItem.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.cart).length > 0) {
      const { menu } = nextProps;
      const products = menu.map(p => p.products).flat();
      const { restaurantName, cart } = this.state;
      console.log(nextProps.cart);
      this.setState({
        restaurantName: restaurantName === "" && cart.cart.length === 0
                        ? nextProps.restaurantName
                        : restaurantName,
        cart: nextProps.cart,
        menu: products,
      })
    }
  }

  deleteItem(item, idx) {
    const { updateCart } = this.props;
    const { cart } = this.state;
    const cartItems = cart.cart;
    if (item.product_amount === 1) {
      cartItems.splice(idx, 1);
    }
    else {
      item.product_amount--;
    }
    updateCart(cart);
  }

  render() {
    const { classes } = this.props;
    const { cart, menu } = this.state;
    var { subtotal } = cart;
    const cartItems = cart.cart;
    subtotal = setTwoDecimal(subtotal);
    const listItems = cartItems.map((item, idx) => {
      const product = menu.find(x => x.id === item.product_id);
      const name = product.name;
      const options = item.product_option_groups.map(group => {
        const gid = group.product_option_group_id;
        const product_option_group = product['product_option_groups'].find(x => x.id === gid);
        return group.product_options.map(id => product_option_group['product_options'].find(x => x.id === id).name);
      }).flat();
      const primary = name+" X "+item.product_amount;
      const secondary = options.join(", ")
      return (
        <ListItem>
          <ListItemText
            primary={primary}
            secondary={secondary}
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete" onClick={(e) => this.deleteItem(item, idx)}>
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
            Total Cost: ${subtotal}
          </Typography>
      </Grid>
    )
  }
}

Cart.propTypes = {
  cartItems: PropTypes.shape({}).isRequired,
};
export default withStyles(styles)(Cart);
