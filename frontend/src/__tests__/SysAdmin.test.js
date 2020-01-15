import React from 'react';
import {SysAdmin} from '../containers/SysAdmin/SysAdmin';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing SysAdmin component', () => {
  
  test('Test if SysAdmin component is rendered', () => {
    shallow(
      <SysAdmin {...getRouterPropsForTest()} />
    );
  });

});
