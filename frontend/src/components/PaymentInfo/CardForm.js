import React from 'react';
import PropTypes from 'prop-types';
import SplitForm from './SplitForm';
import { Elements, StripeProvider } from 'react-stripe-elements';
import apiKeys from '../../apiKeys';
import Button from '../../material-kit/components/CustomButtons/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import withStyles from '@material-ui/core/styles/withStyles';
import modalStyle from '../../material-kit/assets/jss/material-kit-react/modalStyle';


function Transition(props) {
  return <Slide direction="down" {...props} />;
}


class CardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
      flag: false,
    };
    this.postPaymentInfo = this.postPaymentInfo.bind(this);

    window.addEventListener('resize', () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
        this.setState({elementFontSize: '14px'});
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== '18px'
      ) {
        this.setState({elementFontSize: '18px'});
      }
    });
  }

  postPaymentInfo(body) {
    const { postPaymentInfo } = this.props;
    postPaymentInfo(body);
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
    handleConfirm(modal) {
        const x = [];
        x[modal] = false;
        this.setState(x);
        this.setState({flag:true});

  }

  render() {
      const { classes } = this.props;
      return (
<StripeProvider apiKey={apiKeys.stripeAPIKey}>
        <div>
          <Button
            color="info"
            round
            onClick={() => this.handleClickOpen('modal')}
          >
            ADD+

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


              <Elements>
                <SplitForm postPaymentInfo={this.postPaymentInfo} fontSize={this.state.elementFontSize} flag={this.state.flag}/>
              </Elements>


            </DialogContent>
            <DialogActions
              className={`${classes.modalFooter} ${classes.modalFooterCenter}`}
            >


              <Button
                onClick={() => this.handleClose('modal')}
                color="rose">
              close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
          </StripeProvider>
      );
  }
}

CardForm.propTypes = {
  postPaymentInfo: PropTypes.func.isRequired,
};

export default withStyles(modalStyle)(CardForm);
