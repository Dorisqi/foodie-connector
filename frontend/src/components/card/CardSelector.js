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
import CardDialog from 'components/card/CardDialog';
import {loadCard} from 'actions/cardAction';

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
    selectedCard: 0,
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.handleShowCard();
    this.handleAddingCard();

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
    if (value < 0)
    {
      this.setState({
        addingCard: true,
      });
    }
    this.setState({
      selectedCard: value,
    });
  };
  handleAddingCardClose = () => {
    this.setState ({
      addingCard: false,
    });
  };
  handleAddingCard = () => {
    //const cards = res.data;
    //store.dispatch(loadCard(cards, cards[cards.length-1].id));
  };

  render() {
    const {classes} = this.props;
    const {cards, selectedCard, addingCard} = this.state;
    return(
        <div>
          {addingCard
          && (
            <CardDialog
              onClose={this.handleAddingCardClose}
              onUpdate={this.handleAddingCard}
            />
          )
          }
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
                    {'-- card ends with '}
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
    addingCard: state.addingCard,
    cards: state.cards,
});

CardSelector.propTypes = {
  cards: PropTypes.array,
  selectedCard: PropTypes.number,
  classes: PropTypes.object.isRequired,

}
export default withStyles(styles)(
    connect(mapStateToProps)(CardSelector),
);
