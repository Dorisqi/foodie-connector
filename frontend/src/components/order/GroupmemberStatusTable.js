import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import store from 'store';
import { loadOrderinfo, updateGroupmember } from 'actions/orderActions';
import Api from 'facades/Api';
import Axios from 'facades/Axios';
import AddressDialog from 'components/address/AddressDialog';
import Snackbar from 'facades/Snackbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
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
    restaurantId:this.props.restaurantId,
    loadingGroupmbr: null,
    members: [],
    is_creator: null,
    all_ready:false,
    is_joinable:false,
    order:this.props.order
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


  }*/

  componentWillUnmount() {
    //Axios.cancelRequest(this.state.loadingAddress);
  }



  /*handleGroupmbrUpdate = (res) => {
    // TODO:  GET - /api/v1/orders/{id}
    const groupmbrs = res.data;
    //store.dispatch(loadAddress(addresses, addresses[addresses.length - 1].id));
  };*/
  findCreator(member){
      return member.friend_id === this.props.order.creator.friend_id;
  }
  /*loadGroupmbr() {

    //Axios.'/api/v1/orders/'(this.state.loadingGroupmbr);
  //  console.log(this.props.restaurantId);
    this.setState({
      loadingGroupmbr: Api.findOrder(this.props.restaurantId).then((res) => {
        const result = res.data;
        console.log("data:" + res.data[0].is_joinable+res.data[0].restaurant.id +this.props.restaurantId );
        this.setState({
          loadingGroupmbr: null,
          members: res.data[0].order_members.length > 0 ? res.data[0].order_members : null,
          is_creator:res.data[0].is_creator,
          is_joinable: (res.data[0].restaurant.id===this.props.restaurantId && res.data[0].is_joinable) ? true:false,
        });

        console.log("loadGroupmbr: joined" +this.state.is_joinable);


      }).catch((err) => {
        this.setState({
          loadingGroupmbr: null,
        });
        throw (err);
      }),
    });
  }*/

  render() {
    const {
      classes,order
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
                    secondary={"Creator"}

                    />
                    <ListItemText
                      className={classes.setstatus}
                      primary={members[0].is_ready ? "Paid" : "Not paid"}

                    />
                  </div>
                  </ListItem>
              ) :[

                members.map(member => (member.user.friend_id !== order.creator.friend_id &&
                  <ListItem
                    key={member.user.name} // eslint-disable-line react/no-array-index-key
                    className={classes.item}
                  >
                    <div className={classes.itemLine}>
                      <ListItemText
                      primary={(member.user.friend_id !== order.creator.friend_id) ? member.user.friend_id : null}


                      />
                      <ListItemText
                        className={classes.setstatus}
                        primary={member.is_ready ? "Paid" : "Not paid"}

                      />
                    </div>
                    </ListItem>

                ))

              ]

            }
      </div>
    </Card>
    );
  }
}

const mapStateToProps = state => ({
  members: state.members,
  //currentLocation: state.address.currentLocation,
});

GroupmemberStatusTable.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  //currentLocation: PropTypes.object,
};

GroupmemberStatusTable.defaultProps = {
  members: null,
  creator: null,
  loadingGroupmbr:null
};

export default withStyles(styles)(
  connect(mapStateToProps)(GroupmemberStatusTable),
);
