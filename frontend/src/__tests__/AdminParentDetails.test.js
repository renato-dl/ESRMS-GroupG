import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import ConfigParentDetails from '../components/ConfigParent/ConfigParentDetails/ConfigParentDetails';

describe('Testing ConfigParentDetails component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ConfigParentDetails {...getRouterPropsForTest()} />
    );
  });

});
