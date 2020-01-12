import React from 'react';
import {ChangePassword} from '../containers/ChangePassword/ChangePassword';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing ChangePassword component', () => {
  
  test('Test if ChangePassword is rendered', () => {
    shallow(
      <ChangePassword {...getRouterPropsForTest()} />
    );
  });

});