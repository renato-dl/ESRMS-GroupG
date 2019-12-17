import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import TopicDetails from '../components/Topic/TopicDetail/TopicDetails';
import { api } from '../services/api';
import {ApplicationStoreContext} from '../store';

describe('Testing TopicDetails component', () => {
  
  test('Test if topic details component is rendered', async () => {
    const loginData = {
      email: "giulia.tesori@gmail.com",
      password: "easypass",
    };

    const response = await api.auth.login(loginData);

    if (response.data.token){
      localStorage.setItem("token", JSON.stringify(response.data.token));
      shallow(
        <ApplicationStoreContext.Provider value={{state: {userID: '6e5c9976f5813e59816b40a814e29899'}}}>
        <TopicDetails {...getRouterPropsForTest()} />
        </ApplicationStoreContext.Provider>
      );
    }    
  });

});
