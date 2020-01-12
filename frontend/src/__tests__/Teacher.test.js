import React from 'react';
import {Teacher} from '../containers/Teacher/Teacher';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Teacher component', () => {
  
  test('Test if Teacher component is rendered', () => {
    shallow(
      <Teacher {...getRouterPropsForTest()} />
    );
  });

});
