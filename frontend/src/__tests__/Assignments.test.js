import React from 'react';
import {Assignments} from '../components/Assignments/Assignments';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Assignments (Parent view) component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <Assignments {...getRouterPropsForTest()} />
    );
  });

});
