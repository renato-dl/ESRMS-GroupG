import React from 'react';
import {Marks} from '../components/Marks/Marks';
import {render} from '@testing-library/react'
import {getRouterPropsForTest} from '../utils';

describe('Testing Marks component', () => {
  
  test('Test if component is rendered', () => {
    const component = render(
      <Marks {...getRouterPropsForTest()} />
    );
  });

});
