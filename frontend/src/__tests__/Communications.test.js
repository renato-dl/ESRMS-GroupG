import React from 'react';
import {Communications} from '../components/adminComponents/Communications/Communications';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Communications component', () => {
  
  test('Test if Communications component is rendered', () => {
    shallow(
      <Communications {...getRouterPropsForTest()} />
    );
  });

});
