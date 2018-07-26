import 'babel-polyfill';
import './index.css';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import registerServiceWorker from './registerServiceWorker';

import NotFound from './components/NotFound';
import Home from './containers/Home';
import App from './containers/App';

function requireAuth(nextState, replace, next) {
  // check user here
  next();
}

render(
  <BrowserRouter>
    <Switch>
      <Route path='/home' component={Home} onEnter={requireAuth} />
      <Route path='/app' component={App} onEnter={requireAuth} />
      <Redirect from='/' to='/home' exact />
      <Route path='/*' component={NotFound} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

registerServiceWorker();