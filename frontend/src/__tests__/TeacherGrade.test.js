import React from 'react';
import {TeacherGrade} from '../components/TeacherGrade/TeacherGrade';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherGrade component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TeacherGrade {...getRouterPropsForTest()} />
    );
  });

});
