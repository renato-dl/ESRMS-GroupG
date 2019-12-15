import React from 'react';
import {ClassDelete} from '../components/ClassComposition/ClassDelete';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing ClassDelete component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ClassDelete {...getRouterPropsForTest()} />
    );
  });

});
