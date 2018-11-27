import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import store from 'store';
import Api from 'facades/Api';
import Axios from 'facades/Axios';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';

const styles = () => ({
  selector: {
    boxSizing: 'border-box',
  },
  selectorInput: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});

class CardSelector extends React.Component {
  state = {
    cards: [],
    loadingCard: null,
    addingCard: false,
    selectedCard: null,
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.handleShowCard();
  }
  componentWillUnmount() {
    Axios.cancelRequest(this.state.loadingCard);
  }

  handleShowCard = () =>{
    Api.cardList().then((res) => {
        this.setState({
          cards: res.data,
        });
      }).catch((err) => {
        throw err;
      });
  };

  handleSelectCard = (e) => {
    const value = e.target.value;
    this.setState({
      selectedCard: value,
    });
  };
  render() {
    const {classes} = this.props;
    const {cards, selectedCard} = this.state;

    return(
        <div className={classes.selector}>
          <TextField
            select
            variant="outlined"
            value={selectedCard === null ? -1 : selectedCard}
            onChange={this.handleSelectCard}
            fullWidth
          >
            {cards === null
              ? (
                <MenuItem value={-1} disabled>
                  Loading...
                </MenuItem>
              ) : [
                cards.map(card => (
                  <MenuItem key={card.nickname} value={card.nickname}>
                    {card.nickname}
                    {'-- ends with '}
                    {card.last_four}
                  </MenuItem>
                )), (
                  <MenuItem key={-1} value={-1}>
                    + Add New Card
                  </MenuItem>
                ),
              ]
            }
          </TextField>
        </div>
    );
  }
}
const mapStateToProps = state => ({
    selectedCard: state.selectedCard,
    cards: state.cards,
});

CardSelector.propTypes = {
  classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(
    connect(mapStateToProps)(CardSelector),
);
