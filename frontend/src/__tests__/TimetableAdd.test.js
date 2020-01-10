import React from 'react';
import {TimetableAdd} from '../components/adminComponents/ClassTimeTable/TimetableAdd';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TimetableAdd component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TimetableAdd {...getRouterPropsForTest()} />
    );
  });

});
