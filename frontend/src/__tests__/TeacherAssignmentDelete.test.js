import React from 'react';
import {TeacherAssignmentDelete} from '../components/TeacherAssignments/TeacherAssignmentDetails/TeacherAssignmentDelete';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherAssignmentDelete component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TeacherAssignmentDelete {...getRouterPropsForTest()} />
    );
  });

});