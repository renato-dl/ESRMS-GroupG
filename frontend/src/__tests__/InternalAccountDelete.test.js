import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import InternalAccountDelete from '../components/InternalAccounts/InternalAccountDetails/InternalAccountDelete';
import { api } from '../services/api';

describe('Testing InternalAccountDelete component', () => {
  
  test('Test if internal account delete component is rendered', async () => {
    const loginData = {
      email: "admin@phonyschool.com",
      password: "EasyPassAdmin123",
    };

    const response = await api.auth.login(loginData);
    
    if (response.data.token) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      shallow(
        <InternalAccountDelete {...getRouterPropsForTest()} />
      );
    }
  });

});
