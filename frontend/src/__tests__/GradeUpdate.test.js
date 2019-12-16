import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import GradeUpdate from '../components/TeacherGrade/GradeDetail/GradeUpdate';
import { api } from '../services/api';
import {ApplicationStoreContext} from '../store';

describe('Testing GradeUpdate component', () => {
  
  test('Test if grade update component is rendered', async () => {
    const loginData = {
      email: "giulia.tesori@gmail.com",
      password: "easypass",
    };

    const response = await api.auth.login(loginData);
    
    if (response.data.token) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      shallow(
        <ApplicationStoreContext.Provider value={{state: {userID: '26ce21c0-8d32-41d1-8d07-b4994fa53edf'}}}>
        <GradeUpdate {...getRouterPropsForTest()} />
        </ApplicationStoreContext.Provider>
      );
    }
  });

});
