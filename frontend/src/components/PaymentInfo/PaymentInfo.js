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
const id = 0;
function createData(id, nickname,brand,last_four,expiration) {
  id += 1;
  return { id, nickname,brand,last_four,expiration};
}





class PaymentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      selectedEnabled: 1,
    }
    this.postPaymentInfo = this.postPaymentInfo.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);

  }

  componentDidMount() {
    this.loadPaymentInfo();
  }

  loadPaymentInfo() {
    axios.get(apiList.card)
    .then(res => this.setState({ cards: res.data }))
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

  handleChangeEnabled(event) {
    const { value, checked } = event.target;
    this.setState(() => {
      this.state.selectedEnabled = value;
      return { selectedEnabled: value };
    });
  }

  postPaymentInfo(body) {
    console.log(body);
    axios.post(apiList.card, body)
    .then(res => {
      this.setState(state => {
        console.log([...state.cards, res.data]);
        return { cards: [...state.cards, res.data] }
      })
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

  render() {

    const { classes } = this.props;
    const rows = [];
    for (let i = 0; i < this.state.cards.length; i++){
        const expiration = this.state.cards[i].expiration_month+'/'+this.state.cards[i].expiration_year;
            rows.push(
                createData(i,this.state.cards[i].nickname,this.state.cards[i].brand,this.state.cards[i].last_four,
                          expiration)
            );
        }
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
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className={wrapperDiv}>
                    <FormControlLabel
                      control={(
                        <Radio
                          checked={this.state.selectedEnabled == row.id}
                          onChange={this.handleChangeEnabled}
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
                  </div>
                </TableCell>
                <TableCell>{row.nickname}</TableCell>
                <TableCell>{row.brand}</TableCell>
                <TableCell>{row.last_four}</TableCell>
                <TableCell>{row.expiration}</TableCell>


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
