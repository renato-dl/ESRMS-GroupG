import React from 'react';
import {ParentMaterials} from '../components/ParentMaterials/ParentMaterials';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing ParentMaterials component', () => {
  
  test('Test if ParentMaterials component is rendered', () => {
    shallow(
        <ParentMaterials {...getRouterPropsForTest()} />
    );
  });

});
