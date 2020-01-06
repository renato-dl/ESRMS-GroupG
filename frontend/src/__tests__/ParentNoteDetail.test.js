import React from 'react';
import {ChildNoteDetail} from '../components/ChildNote/ChildNoteDetail';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing Assignments (Parent view) component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '9d64fa59c91d9109b11cd9e05162c675'}}}>
        <ChildNoteDetail {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});
