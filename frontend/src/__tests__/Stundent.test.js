import React from 'react';
import {Student} from '../containers/Student/Student';
import renderer from 'react-test-renderer';

describe('Testing Student component', () => {
  
  test('Testing snapshot', () => {
    const component = renderer.create(
      <Student />
    );
  
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

})
