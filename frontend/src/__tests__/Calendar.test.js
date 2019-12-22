import React from 'react';
import {Calendar} from '../components/Calendar/Calendar';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Calendar component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <Calendar {...getRouterPropsForTest()} />
    );
  });

});