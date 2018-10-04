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
import AddingAddress from './AddingAddress';
import axios from 'axios';
import apiList from '../../apiList';

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
    minWidth: 700,
  },
});

const id = 0;
function createData(id,name,full_address,zip_code,is_default) {
  id += 1;
  return {id,name,full_address,zip_code,is_default};
}





class AddressTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // checked:[1,0,0],
      selectedEnabled: 1,
      address:[{
        "id": 4,
        "name": "Test User",
        "phone": "7653500000",
        "line_1": "134 Pierce Street",
        "line_2": "Apt XXX",
        "city": "West Lafayette",
        "state": "IN",
        "zip_code": "47906-5123",
        "place_id": "ChIJO_0IEK_iEogR4GrIyYopzz8",
        "is_default": false
    },
    {
        "id": 5,
        "name": "Test User",
        "phone": "7653500000",
        "line_1": "134 Pierce Street",
        "line_2": "Apt XXX",
        "city": "West Lafayette",
        "state": "IN",
        "zip_code": "47906-5123",
        "place_id": "ChIJO_0IEK_iEogR4GrIyYopzz8",
        "is_default": true
    }
  ]
    };
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
    this.handleAddAddress = this.handleAddAddress.bind(this);
  }

  componentDidMount() {
    console.log('load addresses');
    this.loadAddresses();
  }
  handleAddAddress(address) {
    this.setState(state => {
      console.log([...state.addresses, address]);
      return { addresses: [...state.addresses, address] }
    })
  }
  loadAddresses() {
    axios.get(apiList.addresses)
    .then(res => this.setState({ addresses: res.data }))
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


  render() {
    const { classes } = this.props;
    const rows = [];
    for (let i = 0; i < this.state.address.length; i++){
      const addr = this.state.address[i].line_2+','+
                   this.state.address[i].line_1+','+
                   this.state.address[i].city+','+
                   this.state.address[i].state;

            rows.push(
                createData(i,this.state.address[i].name,addr,this.state.address[i].zip_code,this.state.address[i.is_default])

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
              <TableCell >Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Zip code</TableCell>
              <AddingAddress handleAddAddress={this.handleAddAddress}/>

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
                          checked={this.state.selectedEnabled==row.id}
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
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.full_address}</TableCell>
                <TableCell>{row.zip_code}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

AddressTable.propTypes = {
  classes: PropTypes.element.isRequired,
};

export default withStyles(styles)(AddressTable);
