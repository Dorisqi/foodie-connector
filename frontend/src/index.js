import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Geocode from 'react-geocode';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { Provider as ReactReduxProvider } from 'react-redux';
import registerServiceWorker from 'registerServiceWorker';
import Root from 'components/template/Root';
import store from 'store';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: deepOrange,
  },
});

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.enableDebug();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <ReactReduxProvider store={store}>
      <Router>
        <Route component={Root} />
      </Router>
    </ReactReduxProvider>
  </MuiThemeProvider>,
  document.getElementById('root'),
);
registerServiceWorker();
