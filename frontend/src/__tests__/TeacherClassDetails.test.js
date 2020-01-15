import React from 'react';
import {TeacherClassDetails} from '../components/adminComponents/TeacherClassAssignment/TeacherClassDetails/TeacherClassDetails';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherClassDetails component', () => {
  
  test('Test if TeacherClassDetails component is rendered', () => {
    shallow(
      <TeacherClassDetails {...getRouterPropsForTest()} />
    );
  });

});
