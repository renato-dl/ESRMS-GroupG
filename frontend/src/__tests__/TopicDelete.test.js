import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import TopicDelete from '../components/Topic/TopicDetail/TopicDelete';
import { api } from '../services/api';

describe('Testing TopicDelete component', () => {
  
  test('Test if topic delete component is rendered', async () => {
    const loginData = {
      email: "giulia.tesori@gmail.com",
      password: "easypass",
    };

    const response = await api.auth.login(loginData);
    
    if (response.data.token) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      shallow(
        <TopicDelete {...getRouterPropsForTest()} />
      );
    }
  });

});
