import React from 'react';
import {Teacher} from '../containers/Teacher/Teacherw';
import renderer from 'react-test-renderer';

describe('Testing Subject component', () => {
  
  test('Testing snapshot', () => {
    const component = renderer.create(
      <Teacher />
    );
  
    let tree = component.toJSON();
    expect().toMatchSnapshot();
  });

})
