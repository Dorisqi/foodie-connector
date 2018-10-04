import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ChangepwBox from '../../components/ChangepwBox/ChangepwBox';
import Paper from '@material-ui/core/Paper';
import AddressLists from "../../components/UserAddress/AddressLists";
import Badge from 'components/Badge/Badge';
import UseremailChange from "../../components/UseremailChange/UseremailChange";
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';
import { Redirect } from 'react-router';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 900,
    minHeight:200,
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit ,
    paddingBottom: theme.spacing.unit * 2,
    alignItems: 'center',
    direction: "column",
    justify: "center",
    padding:1*1,
    marginTop: theme.spacing.unit * 7,
    margin: '10px auto 0 auto',


  },
  itermlocation: {
    marginTop: theme.spacing.unit * 7,
    alignItems: 'center',
    direction: "column",
    justify: "center",
  }
});

class ProfileTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    console.log(value);
    this.setState({ value });
  };

  handleChangeIndex = index => {
    console.log('change', index);
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div>
      <Paper className={classes.root} elevation={12}>
        <Typography variant="headline" component="h3">
          User Profile
        </Typography>

        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Order" />
            <Tab label="Address" />
            <Tab label="Email" />
            <Tab label="Password" />
            <Tab label="Payment Info" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>Order History</TabContainer>
          <TabContainer dir={theme.direction}>
          <AddressLists>
          </AddressLists>
          </TabContainer>
          <TabContainer className={classes.itermlocation} dir={theme.direction}>

          <UseremailChange Current="123@purdue.edu"></UseremailChange>
          </TabContainer>
          <TabContainer dir={theme.direction}>
          <div>
            <ChangepwBox>
            </ChangepwBox>
          </div>
          </TabContainer>
          <TabContainer dir={theme.direction}>Payment detail</TabContainer>
        </SwipeableViews>
        </Paper>
      </div>

    );
  }
}

ProfileTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(ProfileTabs);
