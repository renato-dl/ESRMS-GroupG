import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import ClassCompositionDetail from '../components/ClassComposition/ClassCompositionDetail/ClassCompositionDetail';
import { api } from '../services/api';
import {ApplicationStoreContext} from '../store';

describe('Testing ClassCompositionDetail component', () => {
  
  test('Test if class composition detail component is rendered', async () => {
    const loginData = {
      email: "admin@phonyschool.com",
      password: "EasyPassAdmin123",
    };

    const response = await api.auth.login(loginData);
    //console.log(response);
    if (response.data.token) {
      //wconsole.log(response.data.token);
      localStorage.setItem("token", JSON.stringify(response.data.token));
      shallow(
        <ApplicationStoreContext.Provider value={{state: {userID: '26ce21c0-8d32-41d1-8d07-b4994fa53edf'}}}>
        <ClassCompositionDetail {...getRouterPropsForTest()} />
        </ApplicationStoreContext.Provider>
      );
    }
  });

});
