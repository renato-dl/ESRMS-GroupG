import React from 'react';
import {Parent} from '../containers/Parent/Parent';
import {render} from '@testing-library/react';
import {ApplicationStoreContext} from '../store';
import {getRouterPropsForTest} from '../utils';

describe('Testing Parent component', () => {
  
  test('Test if component is rendered', () => {
    const component = render(
      <ApplicationStoreContext.Provider value={{state: {parent: '9d64fa59c91d9109b11cd9e05162c675'}}}>
        <Parent {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});
