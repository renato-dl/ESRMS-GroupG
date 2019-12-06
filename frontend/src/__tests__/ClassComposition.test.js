import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import ClassComposition from '../components/ClassComposition/ClassComposition';

describe('Testing of  class_composition component (admin page)', () => {
  
  test('Test if components for delete a topic are rendered', () => {
    shallow(
      <ClassComposition {...getRouterPropsForTest()} >
      </ClassComposition>
    );
  });

});
