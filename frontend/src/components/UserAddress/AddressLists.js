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
import AddingAddress from './AddingAddress';
import axios from 'axios';
import apiList from '../../apiList';
import EditAddress from './EditAddress';
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
    minWidth: 700,
  },
  colWidth: {
    width: '2rem'
}
});

const index = 0;
function createData(index,id,name,full_address,zip_code,is_default,) {
  //index += 1;
  return {index:index,id: id,name:name,full_address:full_address,zip_code:zip_code,is_default:is_default};
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
    this.deleteaddress = this.deleteaddress.bind(this);
  }

  componentDidMount() {
    console.log('load addresses');
    //alert('load address');
    this.loadAddresses();
  }

  handleAddAddress(address) {
    this.setState(state => {
      console.log([...state.address, address]);
      return { address: [...state.address, address] }
    })
  }
  deleteaddress(value){
    const { name, phone, line_1, line_2, city, state, zip_code, place_id, is_default } = this.state;
    //alert("indes" + this.state.address[value].id);
   const id = this.state.address[value].id;
    //alert('delete:' +event)
    //const { value, checked } = event.target;
    //alert("ididid:" + this.state.address[value].id)
    axios.delete(`/api/v1/addresses/${id}`, {
      name: name,
      phone: phone,
      line_1: line_1,
      line_2: line_2,
      city: city,
      state: state,
      zip_code: zip_code,
      is_default: is_default,
    }).then(res => {
      console.log(res);
      alert("delete successfully!");
      this.state.address.splice(value, 1);
      //handleAddAddress(res);

    }).catch(err => {
      console.log(err);
      const { response } = err;
      if (response && response.status === 401) {
        alert('authentification required');
      }
      else if (response && response.status === 404) {
        alert('Resource not found.');
      }
      else {
        alert('other erro');
      }

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
    if(checked == 0){
    //  alert('value' + value);
      this.setState(() => {
        this.state.selectedEnabled = value;
        return { selectedEnabled: value };
      });
      axios.put(apiList.addressDetail, {
        id: this.state.address[value].id,
        name: this.state.address[value].name,
        phone: this.state.address[value].phone,
        line_1: this.state.address[value].line_1,
        line_2: this.state.address[value].line_2,
        city: this.state.address[value].city,
        state: this.state.address[value].state,
        zip_code: this.state.address[value].zip_code,
        place_id: this.state.address[value].place_id,
        is_default: true,

      }).then(res => {
        console.log(res);
      }).catch(err => {
        const { response } = err;
        console.log(err);
        if (response && response.status === 401) {
          alert('authentification required');
        }
        else if (response && response.status === 422) {
          alert('Validaiton failed');
        }
        else {
          alert('other erro');
        }
      })
    }
    //alert('value' + value);
    this.setState(() => {
      this.state.selectedEnabled = value;
      return { selectedEnabled: value };
    });
    axios.put(apiList.addressDetail, {
      id: this.state.address[value].id,
      name: this.state.address[value].name,
      phone: this.state.address[value].phone,
      line_1: this.state.address[value].line_1,
      line_2: this.state.address[value].line_2,
      city: this.state.address[value].city,
      state: this.state.address[value].state,
      zip_code: this.state.address[value].zip_code,
      place_id: this.state.address[value].place_id,
      is_default: true,

    }).then(res => {
      console.log(res);
    }).catch(err => {
      const { response } = err;
      console.log(err);
      if (response && response.status === 401) {
        alert('authentification required');
      }
      else if (response && response.status === 422) {
        alert('Validaiton failed');
      }
      else {
        alert('other erro');
      }
    })

  }


  render() {
    const { classes } = this.props;
    const rows = [];
      //alert (this.state.address.length);
    for (let i = 0; i < this.state.address.length; i++){

      const addr = this.state.address[i].line_2+','+
                   this.state.address[i].line_1+','+
                   this.state.address[i].city+','+
                   this.state.address[i].state;

            rows.push(
                createData(i,this.state.address[i].id,this.state.address[i].name,
                  addr,this.state.address[i].zip_code,
                  this.state.address[i].is_default)

            );
    }
    const wrapperDiv = classNames(
      classes.checkboxAndRadio,
      classes.checkboxAndRadioHorizontal,
    );
    return (
      <Paper className={classes.root}>
      <AddingAddress handleAddAddress={this.handleAddAddress}/>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Zip code</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>


            </TableRow>
          </TableHead>
          <TableBody>

            {this.state.address.map(address => (
              <TableRow key={address.id}>
                <TableCell padding='Checkbox'>
                  <div className={wrapperDiv}>
                    <FormControlLabel
                      control={(
                        <Radio
                          checked={this.state.selectedEnabled==address.index || address.is_default == true}
                          onChange={this.handleChangeEnabled}
                          value={this.state.address.indexOf(address)}
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
                <TableCell padding='dense'>{address.name}</TableCell>
                <TableCell padding = 'none'>{address.line_1+', '+address.line_2+', '+address.city+', '+address.state}</TableCell>
                <TableCell padding = 'dense'>{address.zip_code}</TableCell>
                <TableCell padding = 'dense'>
                <EditAddress id={address.id} name={address.name} phone={address.phone}
                  line_1={address.line_1}
                  line_2={address.line_2}
                  city={address.city}
                  state={address.state}
                  place_id={address.place_id}
                  zip_code={address.zip_code}
                  is_default={address.is_default}>
                </EditAddress>
                </TableCell>
                <TableCell padding = 'dense'>
                  <IconButton size ='big' aria-label="Delete" onClick={() => this.deleteaddress(this.state.address.indexOf(address))} >

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

AddressTable.propTypes = {
  classes: PropTypes.element.isRequired,
};

export default withStyles(styles)(AddressTable);
