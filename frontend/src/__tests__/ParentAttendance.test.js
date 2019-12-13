import React from 'react';
import {ChildAttendance} from '../components/ChildAttendance/ChildAttendance';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing Assignments (Parent view) component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '32d905eaa2770b66baf20282dff09191'}}}>
        <ChildAttendance {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});
