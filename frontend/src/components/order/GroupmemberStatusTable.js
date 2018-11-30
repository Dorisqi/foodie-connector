import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import Card from '@material-ui/core/Card';


import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const styles = theme => ({
  selector: {
    boxSizing: 'border-box',
  },
  selectorInput: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  item: {
    display: 'block',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  itemLine: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  setstatus: {
    flexGrow: 0,
    paddingRight: 0,
    minWidth: 'fit-content',
  },
});

class GroupmemberStatusTable extends React.Component {
  state = {


  };

  componentDidMount() {


  }

  /*  componentDidUpdate() {
    if(this.state.order === undefined){
      this.loadGroupmbr();
        this.setState({
          members:[],
          is_joinable:false,
          is_creator:null
        });

    }


  } */

  findCreator(member) {
    return member.friend_id === this.props.order.creator.friend_id;
  }
  /* loadGroupmbr() {

    //Axios.'/api/v1/orders/'(this.state.loadingGroupmbr);
  //  console.log(this.props.restaurantId);

  } */

  render() {
    const {
      classes, order,
    } = this.props;
    const members = order.order_members;

    return (
      <Card>
        <div>

          {members.length === 1
            ? (
              <ListItem
                key={order.creator.name} // eslint-disable-line react/no-array-index-key
                className={classes.item}
              >
                <div className={classes.itemLine}>
                  <ListItemText
                    primary={order.creator.name}
                    secondary="Creator"
                  />
                  <ListItemText
                    className={classes.setstatus}
                    primary={members[0].is_ready ? 'Paid' : 'Not paid'}
                  />
                </div>
              </ListItem>
            ) : [

              members.map(member => (member.user.friend_id !== order.creator.friend_id
                  && (
                  <ListItem
                    key={member.user.name} // eslint-disable-line react/no-array-index-key
                    className={classes.item}
                  >
                    <div className={classes.itemLine}>
                      <ListItemText
                        primary={(member.user.friend_id !== order.creator.friend_id)
                          ? member.user.friend_id : null}
                      />
                      <ListItemText
                        className={classes.setstatus}
                        primary={member.is_ready ? 'Paid' : 'Not paid'}
                      />
                    </div>
                  </ListItem>
                  )

              )),

            ]

            }
        </div>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  members: state.members,
  // currentLocation: state.address.currentLocation,
});

GroupmemberStatusTable.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  // currentLocation: PropTypes.object,
};


export default withStyles(styles)(
  connect(mapStateToProps)(GroupmemberStatusTable),
);
