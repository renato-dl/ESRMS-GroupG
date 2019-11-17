import React from 'react';
import {Marks} from '../components/Marks/Marks';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Marks component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <Marks {...getRouterPropsForTest()} />
    );
  });

});
