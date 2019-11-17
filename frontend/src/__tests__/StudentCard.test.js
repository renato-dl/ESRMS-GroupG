import React from 'react';
import { StudentCard } from '../components/StudentCard/StudentCard';
import {shallow} from 'enzyme';

describe('Testing StudentCard component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <StudentCard 
        id="1"
        firstName="Name"
        lastName="Surname"
      />,
    );

  });
});
