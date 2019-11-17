import React from 'react';
import {Student} from '../containers/Student/Student';
import {render} from '@testing-library/react'
import {ApplicationStoreContext} from '../store';

describe('Testing Student component', () => {
  
  test('Test if component is rendered', () => {
    const component = render(
      <ApplicationStoreContext.Provider value={{state: {parent: '9d64fa59c91d9109b11cd9e05162c675'}}}>
        <Student />
      </ApplicationStoreContext.Provider>
    );
  });
});
