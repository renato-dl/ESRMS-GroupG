import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import TeacherClasses from '../components/TeacherClassesAbsence/TeacherClasses';
import {ApplicationStoreContext} from '../store';
describe('Testing TeacherClasses component', () => {
  
  test('Test if component TeacherClasses (teacher)is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '26ce21c0-8d32-41d1-8d07-b4994fa53edf'}}}>
      <TeacherClasses {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});

