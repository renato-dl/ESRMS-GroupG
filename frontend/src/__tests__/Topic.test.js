import React from 'react';
import {Topic} from '../components/Topic/Topic';
import {render} from '@testing-library/react';
import {getRouterPropsForTest} from '../utils';

describe('Testing Topic component', () => {
  
  test('Test if component is rendered', () => {
    const component = render(
      <Topic {...getRouterPropsForTest()} />
    );
  });

});
