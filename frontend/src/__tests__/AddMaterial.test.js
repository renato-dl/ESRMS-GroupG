import React from 'react';
import {AddMaterial} from '../components/TeacherMaterial/TeacherMaterialDetails/AddMaterial';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing AddMaterial component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
        <ApplicationStoreContext.Provider value={{state: {userID: '6e5c9976f5813e59816b40a814e29899'}}}>
            <AddMaterial {...getRouterPropsForTest()} />
        </ApplicationStoreContext.Provider>  
    );
  });

});
