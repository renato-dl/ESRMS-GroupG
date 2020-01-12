import React from 'react';
import {AddMaterial} from '../components/TeacherMaterial/TeacherMaterialDetails/AddMaterial';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing AddMaterial component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <AddMaterial {...getRouterPropsForTest()} />
    );
  });

});
