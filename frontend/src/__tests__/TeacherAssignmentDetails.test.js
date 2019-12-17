import React from 'react';
import {TeacherAssignmentDetails} from '../components/TeacherAssignments/TeacherAssignmentDetails/TeacherAssignmentDetails';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';
describe('Testing TeacherAssignmentDetails component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '26ce21c0-8d32-41d1-8d07-b4994fa53edf'}}}>
      <TeacherAssignmentDetails {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});