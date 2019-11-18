import React from 'react';
import {ConfigParent} from '../components/ConfigParent/ConfigParent';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing ConfigParent component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
        <ConfigParent {...getRouterPropsForTest()} />
    );
  });

});
