import React from 'react';
import {TeacherAssignmentCalendar} from '../components/TeacherAssignments/TeacherAssignmentCalendar/TeacherAssignmentCalendar';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherAssignmentCalendar component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TeacherAssignmentCalendar {...getRouterPropsForTest()} />
    );
  });

});