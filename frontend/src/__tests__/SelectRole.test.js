import React from 'react';
import {SelectRole} from '../containers/SelectRole/SelectRole';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing SelectRole component', () => {
  
  test('Test if SelectRole is rendered', () => {
    shallow(
      <SelectRole {...getRouterPropsForTest()} />
    );
  });

});