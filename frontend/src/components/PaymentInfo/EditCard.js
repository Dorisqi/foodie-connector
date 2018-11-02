import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import States from '../../Statesfile';
import Paper from '@material-ui/core/Paper';
import Button from '../../material-kit/components/CustomButtons/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';
import Avatar from '@material-ui/core/Avatar';
//import iconn from './edit.svg';
import Icon from '@material-ui/core/Icon';

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
  },

  button: {
    margin: theme.spacing.unit,
  },
  buttonright: {
    marginLeft: theme.spacing.unit*28,
    marginRight: theme.spacing.unit*2,

  },
  dense: {
    marginTop: 12,
    marginRight: 10
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  bigAvatar: {
    width: 30,
    height: 30,
  },
  adjustinput: {
    marginTop: 12,
    marginLeft: theme.spacing.unit*6
  },
  menu: {
    width: 200,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    minHeight:300,
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 7,
    paddingBottom: theme.spacing.unit * 2,
    alignItems: 'center',
    justify: "center",
    padding:1*1,
    marginTop: theme.spacing.unit * 7,
    margin: '10px auto 0 auto',
  }
});


class EditCard extends React.Component{
constructor(props){
  super(props);
  this.state = {
    id:"",
    nickname: "",
    expiration_month: "",
    expiration_year: "",
    zip_code: "",
    is_default: false,
  };
  this.handleConfirm = this.handleConfirm.bind(this);
  this.handleEditChange = this.handleEditChange.bind(this);
  this.setDefault = this.setDefault.bind(this);
}

  componentWillReceiveProps(nextProps) {
    const {
      id,
      nickname,
      expiration_month,
      expiration_year,
      zip_code,
      is_default,
    } = nextProps;
    this.setState({
      id: id,
      nickname: nickname,
      expiration_month: expiration_month,
      expiration_year: expiration_year,
      zip_code: zip_code,
      is_default: is_default,
    })
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

  handleZipcode (event) {
    this.setState({ zip_code: event.target.value });
  };
  handlename (event) {
    this.setState({ name: event.target.value });
  };


  handleConfirm(modal){
    const {
      id,
      nickname,
      expiration_month,
      expiration_year,
      zip_code,
      is_default,
    } = this.state;
    const { handleEditSubmit } = this.props;
    handleEditSubmit(id,
      {
        nickname: nickname,
        expiration_month: Number(expiration_month),
        expiration_year: Number(expiration_year),
        zip_code: Number(zip_code),
        is_default: is_default,
      });
    this.setState({[modal]: false});
  }

  setDefault(event) {
    const { checked } = event.target;
    this.setState({
      is_default: checked
    })
  }
  handleEditChange = name => event => {
    const { value } = event.target;
    this.setState({ [name] : value});
  }

  render() {
    const { classes } = this.props;
    const {
      id,
      nickname,
      expiration_month,
      expiration_year,
      zip_code,
      is_default
    } = this.state;

    return (
      <div>
      <IconButton variant="fab"  aria-label="Edit" className={classes.button} onClick={() => this.handleClickOpen('modal')}>
      <Icon>edit_icon</Icon>
      </IconButton>
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

        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            required
            id="outlined-dense"
            label="Nickname"
            value={nickname}
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            onChange={this.handleEditChange('nickname')}
          />
          <TextField
            required
            id="outlined-dense"
            label="Expiration month"
            type="number"
            value={expiration_month}
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            onChange={this.handleEditChange('expiration_month')}
          />
          <TextField
            required
            id="outlined-dense"
            label="Expiration year"
            type="number"
            value={expiration_year}
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            onChange={this.handleEditChange('expiration_year')}
          />
          <TextField
            required
            id="outlined-dense"
            label="Zip code"
            value={zip_code}
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            onChange={this.handleEditChange('zip_code')}
          />
          <div>
            <Checkbox
              checked={is_default}
              onChange={this.setDefault}
              color="primary"
            />
            <label>
              default
            </label>
          </div>

        </form>
        </DialogContent>
        <DialogActions
          className={`${classes.modalFooter} ${classes.modalFooterCenter}`}
        >
          <Button
            onClick={() => this.handleConfirm('modal')}
            color="primary"
          >
            confirm changing
          </Button>
          <Button
            onClick={() => this.handleClose('modal')}
            color="rose"
          >
            Cancle
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  }
}
EditCard.propTypes = {
  classes: PropTypes.object.isRequired,
  nickname:PropTypes.string.isRequired,
  expiration_month:PropTypes.string.isRequired,
  expiration_year:PropTypes.string.isRequired,
  zip_code:PropTypes.string,
};

export default withStyles(styles)(EditCard);
