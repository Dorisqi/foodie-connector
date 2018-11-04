import React from 'react';
import Header from 'components/Header/Header';
import Routes from 'components/Routes';

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
