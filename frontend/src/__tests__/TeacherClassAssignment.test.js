import React from 'react';
import {TeacherClassAssignment} from '../components/adminComponents/TeacherClassAssignment/TeacherClassAssignment';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherClassAssignment component', () => {
  
  test('Test if TeacherClassAssignment component is rendered', () => {
    shallow(
      <TeacherClassAssignment {...getRouterPropsForTest()} />
    );
  });

});
