import React from 'react';
import {TeacherAssignmentDetails} from '../components/TeacherAssignments/TeacherAssignmentDetails/TeacherAssignmentDetails';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherAssignmentDetails component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TeacherAssignmentDetails {...getRouterPropsForTest()} />
    );
  });

});