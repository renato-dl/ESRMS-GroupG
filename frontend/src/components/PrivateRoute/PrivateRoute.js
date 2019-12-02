import React from 'react';
import {Redirect, Route} from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route 
    {...rest} 
    render={(props) => {
      const isAuthenticated = localStorage.getItem('token');
      return isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
    }}
  />
);
