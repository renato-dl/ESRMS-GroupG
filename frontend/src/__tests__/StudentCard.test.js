import React from 'react';
import {render} from '@testing-library/react'
import { StudentCard } from '../components/StudentCard/StudentCard';

describe('Testing StudentCard component', () => {
  
  test('Test if component is rendered', () => {
    const component = render(
      <StudentCard 
        id="1"
        firstName="Name"
        lastName="Surname"
      />,
    );

  });
});
