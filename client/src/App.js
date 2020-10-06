import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Tracker } from './components/Tracker';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
          <Route exact path='/' component={Tracker} />
          <Route exact path='/tracker' component={Tracker} />
          <Route path='/tracker/:user/:datesk?'
              render={(props) => (<Tracker {...props} />)}
          />
      </Layout>
    );
  }
}
