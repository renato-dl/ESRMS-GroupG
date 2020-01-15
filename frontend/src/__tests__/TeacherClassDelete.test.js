import React from 'react';
import {TeacherClassDelete} from '../components/adminComponents/TeacherClassAssignment/TeacherClassDetails/TeacherClassDelete';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherClassDelete component', () => {
  
  test('Test if TeacherClassDelete component is rendered', () => {
    shallow(
      <TeacherClassDelete {...getRouterPropsForTest()} />
    );
  });

});
