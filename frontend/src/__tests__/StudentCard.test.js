import React from 'react';
import renderer from 'react-test-renderer';
import { StudentCard } from '../components/StudentCard/StudentCard';

describe('Testing StudentCard component', () => {
  
  test('Testing snapshot', () => {
    const component = renderer.create(
      <StudentCard 
        id="1"
        firstName="Name"
        lastName="Surname"
      />,
    ); 

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

  });

})
