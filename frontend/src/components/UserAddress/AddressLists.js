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
import EditAddress from './EditAddress';
import Avatar from '@material-ui/core/Avatar';

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
function createData(id,name,full_address,zip_code,is_default,) {
  id += 1;
  return {id: id,name:name,full_address:full_address,zip_code:zip_code,is_default:is_default};
}





class AddressTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // checked:[1,0,0],
      selectedEnabled: 1,
      address: [],
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
      console.log([...state.address, address]);
      return { address: [...state.address, address] }
    })
  }
  loadAddresses() {
    axios.get(apiList.addresses)
    .then(res => this.setState({ address: res.data }))
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
            {this.state.address.map(address => (
              <TableRow key={address.id}>
                <TableCell>
                  <div className={wrapperDiv}>
                    <FormControlLabel
                      control={(

                        <Radio
                          checked={this.state.selectedEnabled==address.id}
                          onChange={this.handleChangeEnabled}
                          value={address.id}
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
                <TableCell>{address.name}</TableCell>
                <TableCell>{address.line_1+', '+address.line_2+', '+address.city+', '+address.state}</TableCell>
                <TableCell>{address.zip_code}</TableCell>

                <EditAddress phone={address.phone}
                  line_1={address.line_1}
                  line_2={address.line_2}
                  city={address.city}
                  state={address.state}
                  zip_code={address.zip_code}>
                </EditAddress>
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
