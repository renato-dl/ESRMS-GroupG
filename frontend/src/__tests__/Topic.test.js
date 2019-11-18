import React from 'react';
import {Topic} from '../components/Topic/Topic';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Topic component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <Topic {...getRouterPropsForTest()} />
    );
  });

});
