import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Check from '@material-ui/icons/Check';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Button from '../../material-kit/components/CustomButtons/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CardForm from './CardForm';
import axios from 'axios';
import apiList from '../../apiList';
import EditCard from './EditCard';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';


const styles = theme => ({
  root: {
    width: '90%',
    minHeight: 300,
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
    margin: '10px auto 0 auto',
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 5,
  },
  table: {
    tableLayout: 'fixed',
  },
  colWidth: {
    width: '2rem'
}
});

const index = 0;
function createData(index,id,name,full_address,zip_code,is_default,) {
  return {index:index,id: id,name:name,full_address:full_address,zip_code:zip_code,is_default:is_default};
}

class PaymentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
    this.postPaymentInfo = this.postPaymentInfo.bind(this);
    this.loadPaymentInfo = this.loadPaymentInfo.bind(this);
    this.handleDeleteCard = this.handleDeleteCard.bind(this);
    this.handleChangeDefault = this.handleChangeDefault.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }

  componentDidMount() {
    console.log('load paymentInfo');
    //alert('load address');
    this.loadPaymentInfo();
  }
  loadPaymentInfo() {
      axios.get(apiList.cards)
      .then(res => {
        //console.log(res.data.map(a => getEditCard(a)));
        this.setState({
          cards: res.data,
          //editCards: res.data.map(a => getEditCard(a))
        });
      })
      .catch(err => {
        const { response } = err;
        if (response && response.status === 401) {
          console.log('not authenticated');
        }
        else {
          console.log(err);
        }
      });
  }

  handleEditSubmit(id, body) {
    console.log(body);
    axios.put(apiList.card(id), body)
    .then(res => {
      this.loadPaymentInfo();
    })
    .catch(err => {
      const { response } = err;
      if (response) {
        if (response.status === 404) {
          alert(`This restaurant(${id}) does not exist.`);
        }
        else if (response.status === 401) {
          alert("This page requires login to access");
        }
        else if (response.status === 422) {
          alert("Validation failed");
        }
        else {
          console.log(err);
        }
      }
      else {
        console.log(err);
      }
    });
  }

  postPaymentInfo(body) {
    axios.post(apiList.cards, body)
    .then(res => {
      this.loadPaymentInfo();
    }).catch(err => {
      const { response } = err;
      if (response) {
        if (response.status === 401) {
          alert('not authenticated')
        }
        else if (response.status === 422) {
          alert('invalid information')
        }
        else {
          console.log(err);
        }
      }
      else {
        console.log(err);
      }
    });
  }

  handleChangeDefault(event) {
    const { value, checked } = event.target;
    console.log(value);
    console.log(checked);
    axios.put(apiList.card(value), { is_default: true})
    .then(res => {
      this.setState(state => {
        const { cards } = state;
        cards.forEach(card => {
          card.is_default = card.id == value;
        });
        return { cards: cards };
      });
    })
    .catch(err => {
      const { response } = err;
      if (response) {
        if (response.status === 401) {
          alert("This page requires login to access");
        }
        else if (response.status === 404) {
          alert(`Card with id(${value}) does not exist`);
        }
        else if (response.status === 422) {
          alert("Validaiton fail");
        }
        else {
          console.log(err);
        }
      }
      else {
        console.log(err);
      }
    });
  }

  handleDeleteCard = id => {
    console.log(id);
    axios.delete(apiList.card(id))
    .then(res => {
      const card = this.state.cards.find(card => card.id == id);
      if (card && card.is_default) {
        console.log('load paymentInfo');
        this.loadPaymentInfo();
      }
      else {
        console.log('just delete');
        this.setState(state => ({
          cards: state.cards.filter(card => card.id != id)
        }))
      }
    })
    .catch(err => {
      const { response } = err;
      if (response) {
        if (response.status === 401) {
          alert("This page requires login to access");
        }
        else if (response.status === 404) {
          alert(`Card with id(${id}) does not exist`);
        }
        else {
          console.log(err);
        }
      }
      else {
        console.log(err);
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { cards } = this.state;

    const wrapperDiv = classNames(
      classes.checkboxAndRadio,
      classes.checkboxAndRadioHorizontal,
    );
    return (
      <Paper className={classes.root}>
        <CardForm postPaymentInfo={this.postPaymentInfo}/>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nickname</TableCell>
              <TableCell>brand</TableCell>
              <TableCell>Last_fout digit</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell>Zip code</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {cards.map(card => (
              <TableRow key={card.id}>
                <TableCell padding='Checkbox'>
                  <div className={wrapperDiv}>
                    <FormControlLabel
                      control={(
                        <Radio
                          checked={card.is_default}
                          onChange={this.handleChangeDefault}
                          value={card.id}
                          name="radio button enabled"
                          aria-label="A"
                          icon={(
                            <FiberManualRecord
                              className={classes.radioUnchecked}
                            />
                          )}
                          checkedIcon={
                            <FiberManualRecord className={classes.radioChecked} />
                        }
                          classes={{
                            checked: classes.radio,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                      }}
                      label=""
                    />
                  </div>
                </TableCell>
                <TableCell padding='dense'>{card.nickname}</TableCell>
                <TableCell padding = 'dense'>{card.brand}</TableCell>
                <TableCell padding = 'dense'>{card.last_four}</TableCell>
                <TableCell padding = 'dense'>{`${card.expiration_month}/${card.expiration_year}`}</TableCell>
                <TableCell padding = 'dense'>{card.zip_code}</TableCell>
                <TableCell padding = 'dense'>
                  <EditCard
                    id={card.id}
                    nickname={card.nickname}
                    expiration_month={card.expiration_month}
                    expiration_year={card.expiration_year}
                    zip_code={card.zip_code}
                    handleEditSubmit={this.handleEditSubmit}
                  />
                </TableCell>
                <TableCell padding = 'dense'>
                  <IconButton size ='big' aria-label="Delete" onClick={() => this.handleDeleteCard(card.id)} >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}
//<AddingAddress handleAddAddress={this.handleAddAddress}/>



PaymentInfo.propTypes = {
  classes: PropTypes.element.isRequired,
};

export default withStyles(styles)(PaymentInfo);
