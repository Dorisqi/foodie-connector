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
function createData(id, Address) {
  id += 1;
  return { id, Address };
}

const rows = [
  createData(0, 'Apt11,123 W Street,West Lafayette,IN'),
  createData(1, 'Apt11,123 W Street,West Lafayette,IN'),
  createData(2, 'Apt11,122 W Street,West Lafayette,IN'),
];

class AddressTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // checked:[1,0,0],
      selectedEnabled: 1,
    };
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
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
              <TableCell numeric>ID</TableCell>
              <TableCell>Address</TableCell>
              <AddingAddress />

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
                <TableCell numeric>{row.id}</TableCell>
                <TableCell>{row.Address}</TableCell>
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
