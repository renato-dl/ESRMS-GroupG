import React from 'react';
import {TeacherMaterial} from '../components/TeacherMaterial/TeacherMaterial';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherMaterial component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TeacherMaterial {...getRouterPropsForTest()} />
    );
  });

});
