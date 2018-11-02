import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import { css, withStyles } from '@material-ui/core/styles';

import Auth from '../../Auth/Auth';
import apiList from '../../apiList';

const styles = theme => ({
  root: {
    width: '100%',
  },
  nested: {
      paddingLeft: theme.spacing.unit * 4,
  },
  price: {
    minWidth: 40,
    maxWidth: 40,
  },
  selected: {
    backgroundColor: "#FFA500",
  },
  notSelected: {

  }
});

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      menu: [],
      selected: {},
      categoryCollapse: {},
      productCollapse: {},
    }
    this.addToCart = this.addToCart.bind(this);
    this.handleCategoryCollapse = this.handleCategoryCollapse.bind(this);
    this.handleProductCollapse = this.handleProductCollapse.bind(this);
    this.handleSelectOptions = this.handleSelectOptions.bind(this);
    this.handleCountChange = this.handleCountChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.menu.length === 0) {
      const { menu } = nextProps;
      const products = menu.map(p => p.products).flat();
      const categoryCollapse = menu.map(p => p.id).reduce((prev, id) => {
        prev[id] = false;
        return prev;
      }, {});
      const productCollapse = products.map(p => p.id).reduce((prev, id) => {
        prev[id] = false;
        return prev;
      }, {});
      const selected = products.reduce((prev, p) => {
        const { id, product_option_groups } = p
        prev[id] = { count: 0 };
        if (product_option_groups.length > 0) {
          prev[id].hasOptions = true;
          product_option_groups.forEach(o => {
            prev[id][o.id] = {
              min: o.min_choice,
              max: o.max_choice? o.max_choice: o.product_options.length,
              count: 0,
              isInRange: o.min_choice === 0,
              options: o.product_options.reduce((o1, o2) => {
                o1[o2.id] = false;
                return o1;
              }, {}),
            };
          });
        }
        else {
          prev.hasOptions = false;
        }
        return prev;
      }, {});
      const addable = products.reduce((prev, p) => {
        const product = selected[p.id];
        if (!product.hasOptions) {
          prev[p.id] = false;
        }
        else {
          prev[p.id] = Object.keys(product).reduce((bool, groupId) => Number.isInteger(+groupId)
                                                                      ? product[groupId].isInRange && bool
                                                                      : true, true);
        }
        return prev;
      }, {});
      console.log(selected);
      console.log(addable);
      this.setState({
        menu: menu,
        categoryCollapse: categoryCollapse,
        productCollapse: productCollapse,
        selected: selected,
        addable: addable,
      });
    }
  }

  addToCart(productId) {
    // const { addToCart } = this.props;
    // addToCart(name);
    // const { selected, addable } = this.state;
    this.setState(state => {
      const { selected, addable } = this.state;
      addable[productId] = false;
      // const { selected } = this.state;
      const product = selected[productId];
      console.log(`${productId} with count ${product.count} added to cart`);
      product.count = 0;
      if (product.hasOptions) {
        Object.keys(product).forEach(groupId => {
          if (Number.isInteger(+groupId)) {
            const group = product[groupId];
            group.count = 0;
            group.isInRange = group.count >= group.min && group.count <= group.max;
            Object.keys(group.options).forEach(optionId => {
              group.options[optionId] = false;
            })
          }
        });
      }
      return {
        selected: selected,
        addable: addable,
      }
    });

  }

  handleCategoryCollapse(id) {
    console.log('category click');
    this.setState(state => {
      const { categoryCollapse } = state;
      categoryCollapse[id] = !categoryCollapse[id];
      return { categoryCollapse: categoryCollapse };
    })
  }

  handleProductCollapse(id) {
    console.log('product click');
    this.setState(state => {
      const { productCollapse } = state;
      productCollapse[id] = !productCollapse[id];
      return { productCollapse: productCollapse };
    })
  }

  handleSelectOptions(productId, optionsId, optionId) {
    console.log(`${productId} ${optionsId} ${optionId}`);
    this.setState(state => {
      const { selected, addable } = state;
      // const { selected } = state;
      const product = selected[productId];
      if (optionsId !== null && optionId !== null) {
        const optionGroups = product[optionsId];
        if (optionGroups.options[optionId]) {
          optionGroups.count--;
          optionGroups.options[optionId] = false;
        }
        else {
          if (optionGroups.count === optionGroups.max) {
            console.log(`max count ${optionGroups.max} reached`);
            Object.keys(optionGroups.options).forEach(optionId => {
              optionGroups.options[optionId] = false;
            })
            optionGroups.count = 1;
          }
          else {
            optionGroups.count++;
          }
          optionGroups.options[optionId] = true;
        }
        optionGroups.isInRange = optionGroups.count >= optionGroups.min && optionGroups.count <= optionGroups.max;
      }
      else {
        product.count++;
      }
      if (!product.hasOptions) {
        addable[productId] = product.count > 0;
      }
      else {
        addable[productId] = true;
        Object.keys(product).forEach(id => {
          if (Number.isInteger(+id)) {
            addable[productId] = addable[productId] && product[id].isInRange;
          }
        });
      }
      console.log(selected);
      console.log(addable);
      return {
        selected: selected,
        addable: addable,
      };
    });
  }

  handleCountChange = id => event => {
    const { value } = event.target;
    this.setState(state => {
      const { selected } = state;
      selected[id].count = value < 0? 0: Math.round(value);
      return { selected: selected };
    })
  }

  render() {
    const { classes } = this.props;
    const {
      menu,
      categoryCollapse,
      productCollapse,
      selected,
      addable
    } = this.state;
    const menuDisplay = menu.map(category => {
      const { id, name, products } = category;
      return (
        <div>
          <ListItem button onClick={() => this.handleCategoryCollapse(id)}>
            <ListItemText primary={name}/>
            {categoryCollapse[id]? <ExpandLess/>: <ExpandMore/>}
          </ListItem>
          <Collapse in={categoryCollapse[id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {products.map(product => {
                  const { id, name, description, min_price, product_option_groups } = product;
                  const productId = id;
                  const hasOptions = product_option_groups.length > 0;
                  const textProps = selected[productId].count && selected[productId].count > 0
                                    ? { primaryTypographyProps: {color: 'primary'} }: null;
                  return (
                    <div>
                      <ListItem
                        button
                        className={classes.nested}
                        onClick={hasOptions
                                  ? () => this.handleProductCollapse(productId)
                                  : () => this.handleSelectOptions(productId, null, null)}>
                        <ListItemText primary={`$${min_price}`} className={classes.price}/>
                        <ListItemText inset primary={name} secondary={description} {...textProps}/>
                        {hasOptions ? (productCollapse[productId]? <ExpandLess/>: <ExpandMore/>) : null}
                      </ListItem>
                      <Collapse in={productCollapse[productId]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {product_option_groups.map(product_option_group => {
                            const { id, name, min_choice, max_choice, product_options } = product_option_group;
                            const optionsId = id;
                            return (
                              <div>
                                <ListItem className={classes.nested}>
                                  <ListItemText inset primary={name}/>
                                </ListItem>
                                <Collapse in timeout="auto" unmountOnExit>
                                  <List component="div" disablePadding>
                                    {product_options.map(product_option => {
                                      const { id, name, price } = product_option;
                                      const optionId = id;
                                      const textProps = selected[productId][optionsId].options[optionId]
                                                        ? { primaryTypographyProps: { color: 'primary' } }: null;
                                      return (
                                        <div>
                                          <ListItem
                                            button
                                            className={classes.nested}
                                            onClick={() => this.handleSelectOptions(productId, optionsId, optionId)}>
                                            <ListItemText inset primary={`$${price}`} className={classes.price}/>
                                            <ListItemText
                                              inset
                                              primary={name}
                                              {...textProps}/>
                                          </ListItem>
                                        </div>
                                      )
                                    })}
                                  </List>
                                </Collapse>
                              </div>
                            );
                          })}
                        </List>
                      </Collapse>
                      <ListItem>
                        <ListItemText primary="count: " primaryTypographyProps={{align: "right"}}/>
                        <Input
                          value={selected[productId].count}
                          onChange={this.handleCountChange(productId)}
                          type="number"
                          min="0"
                          step="1"
                          inputProps={{
                            'aria-label': 'Description',
                          }}
                        />
                      </ListItem>
                      <ListItem button onClick={() => (addable[productId] && selected[productId].count > 0
                                                        ? this.addToCart(productId)
                                                        : alert("missing options or not selected"))}>
                        <ListItemText primary="Add to cart" primaryTypographyProps={{align: "right"}}/>
                      </ListItem>
                    </div>
                  );
                })}
              </List>
          </Collapse>
        </div>
      );}
    );

    return (
      <Grid item xs={12} md={6} className={classes.root}>
        <Typography variant="h1" component="h1" align="center">
          Menu
        </Typography>
        {menuDisplay}
      </Grid>
    )
  }
}
Menu.propTypes = {
  menu: PropTypes.shape({}).isRequired,
};
export default withStyles(styles)(Menu);
