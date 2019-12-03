import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import class_composition from '../components/class_composition/class_composition';

describe('Testing of  class_composition component (admin page)', () => {
  
  test('Test if components for delete a topic are rendered', () => {
    shallow(
      <class_composition {...getRouterPropsForTest()} >
      </class_composition>
    );
  });

});
