import React from 'react';
import {Parent} from '../containers/Parent/Parent';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Parent component', () => {
  
  test('Test if Parent component is rendered', () => {
    shallow(
      <Parent {...getRouterPropsForTest()} />
    );
  });

});
