import { Font, AppLoading } from 'expo';
import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './src/store';
import MainApp from './src/MainApp';


const RobotoThin = require('./src/assets/fonts/Roboto-Thin.ttf');
const RobotoLight = require('./src/assets/fonts/Roboto-Light.ttf');
const RobotoRegular = require('./src/assets/fonts/Roboto-Regular.ttf');


export default class App extends Component {
  constructor() {
    super();
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Font.loadAsync({
      RobotoThin,
      RobotoLight,
      RobotoRegular,
    });
    this.setState({ loading: false });
  }
  render() {
    if (this.state.loading) {
      return <AppLoading/>;
    }
    return (
      <Provider store={store}>
        <MainApp/>
      </Provider>
    );
  }
}
