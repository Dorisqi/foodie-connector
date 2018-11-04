import React from 'react';
import Header from '../Header/Header';
import Routes from '../Routes';

class Root extends React.Component {
  render() {
    const { pathname } = this.props.location;

    return (
      <div>
        {pathname !== '/login' &&
          <Header/>
        }
        <Routes/>
      </div>
    )
  }
}

export default Root;
