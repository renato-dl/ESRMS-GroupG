import React from 'react';
import { render } from 'react-dom';
import { unregister } from './serviceWorker';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import {App} from './containers/App/App';
import { NotFound } from './containers/NotFound/NotFound';

render(
  <BrowserRouter>
    <Switch>
      <Route test={false} exact path="/" component={App} />
      <Route path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
