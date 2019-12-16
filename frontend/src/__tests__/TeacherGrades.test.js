import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import TeacherGrade from '../components/TeacherGrade/TeacherGrade';
import {ApplicationStoreContext} from '../store';
describe('Testing TeacherGrade component', () => {
  
  test('Test if component TeacherGrade (teacher)is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '26ce21c0-8d32-41d1-8d07-b4994fa53edf'}}}>
      <TeacherGrade {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});

