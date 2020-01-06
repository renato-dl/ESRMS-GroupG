import React from 'react';
import {TeacherClassesNote} from '../components/TeacherNote/TeacherClassesNote';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing Assignments (Parent view) component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '6e5c9976f5813e59816b40a814e29899'}}}>
        <TeacherClassesNote {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});
