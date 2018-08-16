import './app.scss';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import React, { Component } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Layout, LocaleProvider } from 'antd';
import Header from '../../components/Header';
import IPList from '../IPList';
import IPDeatil from '../IPDetail';

class App extends Component {
  constructor(props) {
    super(props);
    this.appDOM = null;
  }

  componentDidMount() {
    //this.appDOM.style.minHeight = `${document.documentElement.clientHeight}px`;
    document.getElementById('app').style.minHeight = `${document.documentElement.clientHeight}px`;
  }

  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <Layout id="app" ref={dom => this.appDOM = dom} >
          <Header />
          <div className="header-line" />
          <Switch>
            <Route path='/app/ips/:id' component={IPDeatil} />
            <Route path='/app/ips' component={IPList} exact />
            <Redirect from='/' to='/app/ips' />
          </Switch>
        </Layout>
      </LocaleProvider>
    );
  }
}

export default App;