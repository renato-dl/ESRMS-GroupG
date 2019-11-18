import React from 'react';
import {Teacher} from '../containers/Teacher/Teacher';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Subject component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <Teacher {...getRouterPropsForTest()} />
    );
  });

});
