import React from 'react';
import {TeacherNote} from '../components/TeacherNote/TeacherNote';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing Assignments (Parent view) component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '9d64fa59c91d9109b11cd9e05162c675'}}}>
        <TeacherNote {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});
