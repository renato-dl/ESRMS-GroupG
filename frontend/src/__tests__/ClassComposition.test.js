import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import ClassComposition from '../components/ClassComposition/ClassComposition';
import {ApplicationStoreContext} from '../store';

describe('Testing of  class_composition component (admin page)', () => {
  
  test('Test if components for class composition are rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '205db8275d3c06e6ce3fe7a47b30e0fe'}}}>
      <ClassComposition {...getRouterPropsForTest()} >
      </ClassComposition>
      </ApplicationStoreContext.Provider>
    );
  });

});
