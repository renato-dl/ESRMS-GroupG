import React from 'react';
import {Login} from '../containers/Login/Login';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Login component', () => {
  
  test('Test if Login is rendered', () => {
    shallow(
      <Login {...getRouterPropsForTest()} />
    );
  });

});