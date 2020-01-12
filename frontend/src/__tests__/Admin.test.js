import React from 'react';
import {Admin} from '../containers/Admin/Admin';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Admin component', () => {
  
  test('Test if Admin component is rendered', () => {
    shallow(
      <Admin {...getRouterPropsForTest()} />
    );
  });

});
