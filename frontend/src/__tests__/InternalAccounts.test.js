import React from 'react';
import {InternalAccounts} from '../components/InternalAccounts/InternalAccounts';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing InternalAccounts component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <InternalAccounts {...getRouterPropsForTest()} />
    );
  });

});
