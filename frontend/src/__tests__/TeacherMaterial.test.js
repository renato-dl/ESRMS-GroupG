import React from 'react';
import {TeacherMaterial} from '../components/TeacherMaterial/TeacherMaterial';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing TeacherMaterial component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
        <ApplicationStoreContext.Provider value={{state: {userID: '6e5c9976f5813e59816b40a814e29899'}}}>
            <TeacherMaterial {...getRouterPropsForTest()} />
        </ApplicationStoreContext.Provider>      
    );
  });

});
