import React from 'react';
import {ParentCommunications} from '../components/ParentCommunications/ParentCommunications';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing ParentCommunications component', () => {
  
  test('Test if ParentCommunications component is rendered', () => {
    shallow(
      <ParentCommunications {...getRouterPropsForTest()} />
    );
  });

});
