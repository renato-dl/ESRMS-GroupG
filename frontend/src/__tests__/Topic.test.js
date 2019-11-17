import React from 'react';
import {Topic} from '../components/Topic/Topic';
import renderer from 'react-test-renderer';

describe('Testing Topic component', () => {
  
  test('Testing snapshot', () => {
    const component = renderer.create(
      <Topic />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

})
