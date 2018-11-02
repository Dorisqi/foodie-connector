import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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
function createData(index,name,is_confirmed) {
  //index += 1;
  return {index:index,name:name,,is_confirmed:is_confirmed};
}

class GroupmemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // checked:[1,0,0],
      allconfirmed:0
      members: [],
    };
    this.handleMemberComfirm = this.handleMemberComfirm.bind(this);
    this.handleAddMember = this.handleAddMember.bind(this);
  }

  componentDidMount() {
    console.log('load member');
    //alert('load address');
    this.loadMember();
  }
  loadMember() {
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

  handleAddMember(member) {
    this.setState(state => {
      console.log([...state.members, member]);
      return { address: [...state.members, member] }
    })
  }


render(){

  const { classes } = this.props;
  const rows = [];
    //alert (this.state.address.length);
  for (let i = 0; i < this.state.members.length; i++){


          rows.push(
              createData(i,this.state.members[i].index,this.state.address[i].name,
                          this.state.address[i].is_confirmed)

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
            <TableCell/>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Zip code</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
            {this.state.members.map(member => (
              <TableRow key={member.index}>
                <TableCell padding='dense'>{member.name}</TableCell>
                <TableCell padding='Checkbox'>
                  <div className={wrapperDiv}>
                    <FormControlLabel
                      control={(

                        <Radio
                          checked={member.isConfirmed == true}
                          value={this.state.members.indexOf(member)}
                          name="member congirm status"
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
              </TableRow>
            ))}

        </TableBody>
      </Table>
    </Paper>
  );

  }
}

GroupmemberList.propTypes = {
  classes: PropTypes.element.isRequired,
};

export default withStyles(styles)(GroupmemberList);
