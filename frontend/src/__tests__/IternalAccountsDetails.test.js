import React from 'react';
import {InternalAccountDetails} from '../components/InternalAccounts/InternalAccountDetails/InternalAccountDetails';
import {ApplicationStoreContext} from '../store';
import {shallow} from 'enzyme';

describe('Testing InternalAccountDetails component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '205db8275d3c06e6ce3fe7a47b30e0fe'}}}>
        <InternalAccountDetails />
      </ApplicationStoreContext.Provider>
    );
  });
});