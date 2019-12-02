import React from 'react';
import { render } from 'react-dom';
import { unregister } from './serviceWorker';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';


import 'semantic-ui-css/semantic.min.css';
import {App} from './containers/App/App';
import { Login } from './containers/Login/Login';

render(
  <BrowserRouter>
    <Switch>
      
      <Route exact path="/login" component={Login} />
      
      <Route exact path="/" render={() => {
          const role = localStorage.getItem('role');

          switch(role) {
            case 'IsTeacher':
              return (<Redirect to="/teacher" />);
            case 'IsParent':
              return (<Redirect to="/parent" />);
            case 'IsSysAdmin':
              return (<Redirect to="/sysadmin" />);
            case 'IsAdmin':
              return (<Redirect to="/admin" />);
            default:
              return (<Redirect to="/login" />);
          }
          
        }} 
      />
      <Route path="/" component={App} />

    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
