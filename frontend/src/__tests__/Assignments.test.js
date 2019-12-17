import React from 'react';
import {Assignments} from '../components/Assignments/Assignments';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing Assignments (Parent view) component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '205db8275d3c06e6ce3fe7a47b30e0fe'}}}>
        <Assignments {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});
