import React from 'react';
import {TeacherAssignments} from '../components/TeacherAssignments/TeacherAssignments';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherAssignments component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TeacherAssignments {...getRouterPropsForTest()} />
    );
  });

});