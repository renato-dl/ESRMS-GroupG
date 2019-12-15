import React from 'react';
import {TeacherAssignment} from '../components/TeacherAssignments/TeacherAssignmentDetails/TeacherAssignment';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherAssignment component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TeacherAssignment {...getRouterPropsForTest()} />
    );
  });

});