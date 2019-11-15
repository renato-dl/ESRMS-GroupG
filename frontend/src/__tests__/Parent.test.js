import React from 'react';
import {Parent} from '../containers/Parent/Parent';
import renderer from 'react-test-renderer';

describe('Testing Parent component', () => {
  
  test('Testing snapshot', () => {
    const component = renderer.create(
      <Parent />
    );
  
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    
  });

})
