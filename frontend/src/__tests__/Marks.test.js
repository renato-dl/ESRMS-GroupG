import React from 'react';
import {Marks} from '../components/Marks/Marks';
import renderer from 'react-test-renderer';

describe('Testing Marks component', () => {
  
  test('Testing snapshot', () => {
    const component = renderer.create(
      <Marks />
    );
  
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    
  });

})
