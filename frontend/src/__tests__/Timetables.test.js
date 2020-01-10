import React from 'react';
import {Timetables} from '../components/adminComponents/ClassTimeTable/Timetables';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing Timetables component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <Timetables {...getRouterPropsForTest()} />
    );
  });

});
