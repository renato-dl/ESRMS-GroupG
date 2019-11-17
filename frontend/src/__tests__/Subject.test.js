import React from 'react';
import {Teacher} from '../containers/Teacher/Teacher';
import {render} from '@testing-library/react'
import {getRouterPropsForTest} from '../utils';

describe('Testing Subject component', () => {
  
  test('Test if component is rendered', () => {
    const component = render(
      <Teacher {...getRouterPropsForTest()} />
    );
  });

});
