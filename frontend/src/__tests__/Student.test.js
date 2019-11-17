import React from 'react';
import {Student} from '../containers/Student/Student';
import {ApplicationStoreContext} from '../store';
import {shallow} from 'enzyme';

describe('Testing Student component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {parent: '9d64fa59c91d9109b11cd9e05162c675'}}}>
        <Student />
      </ApplicationStoreContext.Provider>
    );
  });
});
