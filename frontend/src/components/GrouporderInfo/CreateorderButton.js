import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import States from '../../Statesfile';
import Paper from '@material-ui/core/Paper';
import Button from '../../material-kit/components/CustomButtons/Button';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import Radio from "@material-ui/core/Radio";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import ShareLink from "../ShareLink/ShareLink";
import ShareViaQR from "../ShareViaQR/ShareViaQR";
import ShareViaThird from "../ShareViaThird/ShareViaThird";
import {
  primaryColor,
  dangerColor,
  roseColor,
  grayColor
} from "../../material-kit/assets/jss/material-kit-react.jsx";
import axios from 'axios';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';
//get location:
import Geocode from 'react-geocode';



function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,
    width: 30,
    height:10
  },
  button: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,
  },
  buttonright: {
    marginLeft: theme.spacing.unit*28,
    marginRight: theme.spacing.unit*2,

  },
  dense: {
    marginTop: 12,
    marginRight: 10,
    marginLeft:30
  },
  rightcomp:{
    marginRight: 10,
    marginLeft: 10
  },
  leftcomp:{
    marginRight: 10,
    marginLeft:10
  },
  nametoright: {
    marginLeft: 120
  },
  adjustzipcode: {
    marginLeft: 120
  },
  menu: {
    width: 200,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    minHeight:300,
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit * 2,
    alignItems: 'center',
    justify: "center",
    padding:1*1,
    marginTop: theme.spacing.unit ,
    margin: '10px auto 0 auto',


  }
});


class CreateorderButton extends React.Component{
constructor(props){
  super(props);
  this.state = {
    restaurantname: "",
    restaurant_id: "",
    delivery_address_id:"",
    orderid:"",
    selectedStatus:true,
    hours:"0",
    minutes:10,
    calculated_time:600,
    qr_code:"http://localhost:8000/orders/qr-code/9B151C",
    share_link:"http://localhost:8000/orders/9B151C"


  };

  this.handleCreateorder = this.handleCreateorder.bind(this);
  this.handleClickOpen = this.handleClickOpen.bind(this);
  this.handleClose = this.handleClose.bind(this);
  this.updateOrderStatus = this.updateOrderStatus.bind(this);
  this.handleHour = this.handleHour.bind(this);
  this.handleMinute= this.handleMinute.bind(this);


}



  componentDidMount() {
      this.forceUpdate();
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

  updateOrderStatus(event) {
    const {value} = event.target;

    if (value === "1"){
      this.setState({selectedStatus: true });
    } else {
      this.setState({selectedStatus: false });
    }


  }

  handleHour(event){
    this.setState({hours: event.target.value})
  }
  handleMinute(event){
    this.setState({minutes: event.target.value})
  }



  handleCreateorder(modal){

    //const { name, phone, line_1, line_2, city, state, zip_code, place_id, is_default } = this.state;
    //const { handleAddAddress } = this.props;

    const x = [];
    x[modal] = false;
    this.setState(x);



  /*axios.post(apiList.addressDetail, {
      restaurantname:"",
      selectedStatus:"1",
      hours:this.state.hours,
      minutes:this.state.minutes

    }).then(res => {
      console.log(res);
      //handleAddAddress(res.data);
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
    })*/

  }

    render(){
      const{classes} = this.props;
      const wrapperDiv = classNames(
      classes.checkboxAndRadio,
      classes.checkboxAndRadioHorizontal
    );
      return(


        <div>
          <Button
            color="info"
            round
            onClick={() => this.handleClickOpen('modal')}
          >
            Create Group Order
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
            <div>
                <Typography variant="subtitle1" gutterBottom>
                Here is Order setting :
                </Typography>

                <Grid container xs={12} sm={12} justify="space-evenly">

                   <div className={wrapperDiv}>
                     <FormControlLabel
                       control={
                         <Radio
                           checked={this.state.selectedStatus === true}
                           onChange={this.updateOrderStatus}
                           value="1"
                           name="public"
                           color="primary"
                           aria-label="public"
                           icon={
                             <FiberManualRecord
                               className={classes.radioUnchecked}
                             />
                           }
                           checkedIcon={
                             <FiberManualRecord className={classes.radioChecked} />
                           }
                           classes={{
                             checked: dangerColor
                           }}
                         />
                       }
                       classes={{
                         label: classes.label
                       }}
                       label="Public"
                     />

                     <FormControlLabel
                       control={
                         <Radio
                           checked={this.state.selectedStatus === false}
                           onChange={this.updateOrderStatus}
                           value="0"
                           color="primary"
                           name="private"
                           aria-label="Private"
                           icon={
                             <FiberManualRecord
                               className={classes.radioUnchecked}
                             />
                           }
                           checkedIcon={
                             <FiberManualRecord className={classes.radioChecked} />
                           }
                           classes={{
                             checked: classes.radio
                           }}
                         />
                       }
                       classes={{
                         label: classes.label
                       }}
                       label="Private"
                     />
                   </div>



                      <Grid item xs={6} sm={3}>
                         <TextField
                            required
                            id="hours"
                            label="Hours"
                            InputLabelProps={{ shrink: true }}
                            className = {classes.leftcomp}
                            value={this.state.hours}
                            margin="dense"
                            variant="outlined"
                            number
                            onChange={this.handleHour}
                            InputProps={{
                            endAdornment: (
                              <InputAdornment variant="filled" position="end">
                                Hrs
                              </InputAdornment>
                            ),
                            }}

                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                              <TextField
                                 required
                                 InputLabelProps={{ shrink: true }}
                                 id="minutes"
                                 label="Minutes"
                                 className = {classes.rightcomp}
                                 value={this.state.minutes}
                                 margin="dense"
                                 number
                                 variant="outlined"
                                 onChange={this.handleMinute}
                                 InputProps={{
                                 endAdornment: (
                                   <InputAdornment variant="filled" position="end">
                                     Mins
                                   </InputAdornment>
                                 ),
                               }}
                                 />
                          </Grid>
                          <Tooltip
                            id="tooltip-right"
                            title="Total Join Time need to be between 10 mins and 2 hours!"
                            placement="top"
                            classes={{ tooltip: classes.tooltip }}
                          >

                            <svg
                              src="https://cdn0.iconfinder.com/data/icons/travel-vacation/289/travel-transport-hotel-vacation-holidays-tourist-tourism-travelling-traveling_178-512.png"
                              width="20"
                              height="20"
                              viewBox="0 0 23 23"
                            >
                              <path fill="none" d="M0 0h24v24H0z" />
                              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                            </svg>
                          </Tooltip>
                      </Grid>
               <Button
                 onClick={() => this.handleCreateorder('modal')}
                 color="primary"
               >
                 Create
               </Button>

              </div>
              <div>
              <CustomLinearProgress
                variant="determinate"
                color="primary"
                value={0}
              />
              </div>
              <div>
                <ShareLink share_link={this.state.share_link}>
                  </ShareLink>
                <ShareViaQR qr_code_link = {this.state.qr_code}> </ShareViaQR>
              </div>

          </DialogContent>
          <DialogActions
            className={`${classes.modalFooter} ${classes.modalFooterCenter}`}
          >

            <Button
              onClick={() => this.handleClose('modal')}
              color="default"
            >
              Cancle
            </Button>
          </DialogActions>
        </Dialog>
        </div>




      );
    }


}

CreateorderButton.propTypes = {
  classes: PropTypes.element.isRequired,

};

export default withStyles(styles)(CreateorderButton);
