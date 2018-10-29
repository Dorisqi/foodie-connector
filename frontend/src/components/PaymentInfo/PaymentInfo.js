import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardForm from './CardForm';
import axios from 'axios';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';
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
import CardInfo from './CardInfo';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { CardExpiryElement } from 'react-stripe-elements';
import Input from '@material-ui/core/Input';

import classNames from 'classnames';


const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  root: {
    width: '100%',
    minHeight: 300,
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
    margin: '10px auto 0 auto',
    paddingLeft: theme.spacing.unit ,
    paddingRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  table: {
    minWidth: 900,
  },

});

// const id = 0;
// function createData(id, nickname,brand,last_four,expiration, is_default) {
//   id += 1;
//   return { id, nickname,brand,last_four,expiration, is_default};
// }

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

function getEditCard(card) {
  return {
    id: card.id,
    nickname: card.nickname,
    expiration_month: card.expiration_month,
    expiration_year: card.expiration_year,
    zip_code: '',
    is_default: card.is_default,
    brand: card.brand,
    last_four: card.last_four
  }
}

class PaymentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      editCards: [],
      selectedEnabled: 1,
    }
    this.postPaymentInfo = this.postPaymentInfo.bind(this);
    this.handleCardonChange = this.handleCardonChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleEditCheck = this.handleEditCheck.bind(this);
  }

  componentDidMount() {
    this.loadPaymentInfo();
  }

  loadPaymentInfo() {
    axios.get(apiList.card)
    .then(res => {
      console.log(res.data.map(a => getEditCard(a)));
      this.setState({
        cards: res.data,
        editCards: res.data.map(a => getEditCard(a))
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

  handleCardonChange = (id, filed) => event => {
    const { value } = event.target;
    this.setState((state) => {
      editCards: state.editCards.map(c => {
        if (c.id != id) {
          return c;
        }
        c[filed] = value;
        return c;
      })
    })
  }
  handleEditCheck = id => event => {
    const { checked } = event.target;
    this.setState((state) => {
      editCards: state.editCards.map(c => {
        if (c.id != id) {
          return c;
        }
        c.is_default = checked;
        return c;
      })
    })
  }
  handleEditSubmit = id => event => {
    const editCard  = this.state.editCards.filter(c => c.id == id)[0];
    const body = {
      nickname: editCard.nickname,
      expiration_month: Number(editCard.expiration_month),
      expiration_year: Number(editCard.expiration_year),
      zip_code: Number(editCard.zip_code),
      is_default: editCard.is_default
    }
    console.log(id+": "+body);
    axios.put(apiList.card+'/'+id, body)
    .then(res => {
      console.log("loadPaymentInfo");
      this.loadPaymentInfo();
    })
    .catch(err => {
      console.log(err);
    })
    event.preventDefault();
  }
  postPaymentInfo(body) {
    axios.post(apiList.card, body)
    .then(res => {
      this.loadPaymentInfo();
    }).catch(err => {
      const { response } = err;
      if (response) {
        if (response.status === 401) {
          console.log('not authenticated')
        }
        else if (response.status === 422) {
          console.log('invalid information')
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

  handleClickOpen(modal) {
    const x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    const x = [];
    x[modal] = false;
    this.setState(x);
  }


  render() {

    const { classes } = this.props;
    const { editCards } = this.state;
    const wrapperDiv = classNames(
      classes.checkboxAndRadio,
      classes.checkboxAndRadioHorizontal,
    );

    return (

      <Paper className={classes.root}>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nickname</TableCell>
              <TableCell>brand</TableCell>
              <TableCell numeric>Last_fout digit</TableCell>
              <TableCell>Expiration</TableCell>

              <CardForm postPaymentInfo={this.postPaymentInfo}/>

            </TableRow>
          </TableHead>
          <TableBody>
            {editCards.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className={wrapperDiv}>
                    <FormControlLabel
                      control={(
                        <Radio
                          checked={row.is_default}
                          value={row.id}
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
                    <div>
                      <Button
                        color="info"
                        round
                        onClick={() => this.handleClickOpen('modal')}
                      >
                      Edit
                      </Button>
                      <Dialog
                        classes={{
                          root: classes.center,
                          paper: classes.modal,
                        }}
                        open={this.state.modal}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => this.handleClose('modal')}
                        aria-labelledby="modal-slide-title"
                        aria-describedby="modal-slide-description"
                      >
                        <DialogContent
                          id="modal-slide-description"
                          className={classes.modalBody}
                        >


                        </DialogContent>
                        <form onSubmit={this.handleEditSubmit(row.id)}>
                          <label>
                            Nickname
                            <input name="name" type="text"
                                   onChange={this.handleCardonChange(row.id, 'nickname')} required />
                          </label>
                          <label>
                            Expiration month
                            <input name="month" type="number" min="1" max="12"
                                   onChange={this.handleCardonChange(row.id, 'expiration_month')} required />
                          </label>
                          <label>
                            Expiration year
                            <input name="year" type="number" min="2018"
                                   onChange={this.handleCardonChange(row.id, 'expiration_year')} required />
                          </label>
                          <label>
                            Zip code
                            <input name="zip_code" type="number"
                                   onChange={this.handleCardonChange(row.id, 'zip_code')} required />
                          </label>
                          <label>
                            <Checkbox
                              onChange={this.handleEditCheck(row.id)}
                              color="primary"
                            />
                            <label>
                              set to default
                            </label>
                          </label>
                          <br/>
                          <br/>
                          <Input type="submit" value="Submit" />
                        </form>
                        <DialogActions
                          className={`${classes.modalFooter} ${classes.modalFooterCenter}`}
                        >


                          <Button
                            onClick={() => this.handleClose('modal')}
                            color="rose">
                          close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{row.nickname}</TableCell>
                <TableCell>{row.brand}</TableCell>
                <TableCell>{row.last_four}</TableCell>
                <TableCell>{row.expiration_month+'/'+row.expiration_year}</TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>


    );
  }
}

PaymentInfo.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(PaymentInfo);
