import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import TeacherGrade from '../components/TeacherGrade/TeacherGrade';

describe('Testing TeacherGrade component', () => {
  
  test('Test if component TeacherGrade (teacher)is rendered', () => {
    shallow(
      <TeacherGrade {...getRouterPropsForTest()} />
    );
  });

});

