import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import Price from 'facades/Price';
import AmountSelector from './AmountSelector';

const styles = theme => ({
  productOptionSelector: {
    boxSizing: 'border-box',
    maxWidth: '100%',
    width: 800,
  },
  dialogContent: {
    paddingBottom: 0,
  },
  optionList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit,
  },
  option: {
    boxSizing: 'border-box',
    marginTop: 0.8 * theme.spacing.unit,
    marginBottom: 0.8 * theme.spacing.unit,
    marginLeft: 0,
    marginRight: 0,
    paddingRight: theme.spacing.unit,
    minWidth: '50%',
  },
  optionCheckComponent: {
    padding: 0,
    marginRight: theme.spacing.unit,
  },
  price: {
    marginTop: theme.spacing.unit,
    paddingLeft: 3 * theme.spacing.unit,
    paddingRight: 3 * theme.spacing.unit,
    textAlign: 'right',
  },
  amountSelector: {
    margin: 0,
    paddingLeft: 3 * theme.spacing.unit,
    paddingRight: 3 * theme.spacing.unit,
  },
});

class ProductOptionSelector extends React.Component {
  state = {
    isOpen: true,
    selected: {},
    price: 0,
    productAmount: 1,
  };

  constructor(props) {
    super(props);

    const selected = {};
    const { product, cartItem } = props;
    if (cartItem === null) {
      _.forIn(product.product_option_group_map, ((optionGroup, id) => {
        selected[id] = optionGroup.is_radio
          ? optionGroup.product_options[0].id
          : {};
      }));
    } else {
      cartItem.product_option_groups.forEach((cartOptionGroup) => {
        const groupId = cartOptionGroup.product_option_group_id;
        const optionGroup = product.product_option_group_map[groupId];
        if (optionGroup.is_radio) {
          selected[groupId] = cartOptionGroup.product_options[0];
        } else {
          const selection = {};
          cartOptionGroup.product_options.forEach((optionId) => {
            selection[optionId] = true;
          });
          selected[groupId] = selection;
        }
      });
      this.state.productAmount = cartItem.product_amount;
    }
    this.state.selected = selected;
    this.state.price = this.price();
  }

  onClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  onExited = () => {
    this.props.onClose();
  };

  handleCheckboxChange = (groupId, id) => (_e, checked) => {
    const { selected } = this.state;
    const groupSelection = { ...selected[groupId] };
    if (checked) {
      groupSelection[id] = true;
    } else {
      delete groupSelection[id];
    }
    const newSelected = { ...selected };
    newSelected[groupId] = groupSelection;
    this.setState({
      selected: newSelected,
      price: this.price(newSelected),
    });
  };

  handleRadioChange = (groupId, id) => (_e, checked) => {
    if (checked) {
      const { selected } = this.state;
      const newSelected = { ...selected };
      newSelected[groupId] = id;
      this.setState({
        selected: newSelected,
        price: this.price(newSelected),
      });
    }
  };

  handleSubmit = () => {
    const { product } = this.props;
    const { selected, productAmount, price } = this.state;
    const optionGroups = [];
    _.forIn(selected, (selection, optionGroupId) => {
      const optionGroup = product.product_option_group_map[optionGroupId];
      optionGroups.push({
        product_option_group_id: Number(optionGroupId),
        product_options: optionGroup.is_radio
          ? [selection]
          : Object.keys(selection).map(id => Number(id)),
      });
    });
    this.props.onUpdateItem({
      product_id: product.id,
      product_amount: productAmount,
      product_price: price,
      product_option_groups: optionGroups,
    });
    this.onClose();
  };

  handleAmountUpdate = (amount) => {
    this.setState({
      productAmount: amount,
    });
  };

  price(newSelected) {
    let selected = null;
    if (!_.isNil(newSelected)) {
      selected = newSelected;
    } else {
      selected = this.state.selected;
    }
    const { product } = this.props;
    let price = product.price;
    product.product_option_groups.forEach((optionGroupId) => {
      const optionGroup = product.product_option_group_map[optionGroupId];
      const selection = selected[optionGroupId];
      if (optionGroup.is_radio) {
        price += optionGroup.product_option_map[selection].price;
      } else {
        Object.keys(selection).forEach((optionId) => {
          price += optionGroup.product_option_map[optionId].price;
        });
      }
    });
    return price.toFixed(2);
  }

  render() {
    const { product, classes, cartItem } = this.props;
    const {
      isOpen, selected, productAmount, price,
    } = this.state;
    const isUpdate = cartItem !== null;
    let overallSelectionLimitError = false;
    return (
      <Dialog
        open={isOpen}
        onClose={this.onClose}
        onExited={this.onExited}
        classes={{
          paper: classes.productOptionSelector,
        }}
        aria-labelledby="product-option-selector-title"
      >
        <DialogTitle id="product-option-selector-title">
          {product.name}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {product.product_option_groups.map((optionGroupId) => {
            const optionGroup = product.product_option_group_map[optionGroupId];
            let selectionLimitText = '';
            if (optionGroup.min_choice === optionGroup.max_choice) {
              selectionLimitText = `Must choose ${optionGroup.min_choice}`;
            } else {
              if (optionGroup.min_choice > 0) {
                selectionLimitText = `Must choose at least ${optionGroup.min_choice} `;
              }
              if (optionGroup.max_choice !== null) {
                selectionLimitText += `Can choose at most ${optionGroup.max_choice}`;
              }
              if (selectionLimitText.length === 0) {
                selectionLimitText = 'Can choose any';
              }
            }
            let selectionLimitError = false;
            if (!optionGroup.is_radio) {
              const selectionCount = Object.keys(selected[optionGroupId]).length;
              if (selectionCount < optionGroup.min_choice
                || (optionGroup.max_choice !== null && selectionCount > optionGroup.max_choice)) {
                selectionLimitError = true;
                overallSelectionLimitError = true;
              }
            }
            return (
              <div key={optionGroupId}>
                <DialogContentText
                  variant="h6"
                  color="textPrimary"
                  component="h4"
                >
                  {optionGroup.name}
                </DialogContentText>
                <DialogContentText
                  variant="caption"
                  component="div"
                  color={selectionLimitError ? 'error' : 'textSecondary'}
                >
                  {selectionLimitText}
                </DialogContentText>
                <FormGroup className={classes.optionList}>
                  {optionGroup.product_options.map(option => (
                    <FormControlLabel
                      className={classes.option}
                      control={optionGroup.is_radio
                        ? (
                          <Radio
                            className={classes.optionCheckComponent}
                            checked={selected[optionGroupId] === option.id}
                            onChange={this.handleRadioChange(optionGroupId, option.id)}
                          />
                        )
                        : (
                          <Checkbox
                            className={classes.optionCheckComponent}
                            checked={selected[optionGroupId][option.id] === true}
                            onChange={this.handleCheckboxChange(optionGroupId, option.id)}
                          />
                        )
                      }
                      value={option.id.toString()}
                      label={option.price === 0
                        ? option.name
                        : `${option.name} - ${Price.display(option.price)}`
                      }
                      key={option.id}
                    />
                  ))}
                </FormGroup>
              </div>
            );
          })}
        </DialogContent>
        <Typography
          className={classes.price}
          variant="h6"
          component="div"
          color="textPrimary"
        >
          Price:
          {' '}
          {Price.display(price)}
        </Typography>
        <div className={classes.amountSelector}>
          <AmountSelector
            value={productAmount}
            onUpdate={this.handleAmountUpdate}
          />
        </div>
        <DialogActions>
          <Button onClick={this.onClose}>Cancel</Button>
          <Button
            onClick={this.handleSubmit}
            color="primary"
            disabled={overallSelectionLimitError}
          >
            {isUpdate ? 'Update' : 'Add to cart'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ProductOptionSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  onClose: PropTypes.object.isRequired,
  onUpdateItem: PropTypes.func.isRequired,
  cartItem: PropTypes.object,
};

ProductOptionSelector.defaultProps = {
  cartItem: null,
};

export default withStyles(styles)(ProductOptionSelector);
