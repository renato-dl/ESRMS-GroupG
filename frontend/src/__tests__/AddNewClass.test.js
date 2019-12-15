import React from 'react';
import {AddNewClass} from '../components/ClassComposition/AddNewClass';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing AddNewClass component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <AddNewClass {...getRouterPropsForTest()} />
    );
  });

});
