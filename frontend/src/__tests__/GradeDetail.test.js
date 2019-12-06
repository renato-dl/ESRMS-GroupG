import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import GradeDetail from '../components/TeacherGrade/GradeDetail/GradeDetail';
import { api } from '../services/api';

describe('Testing GradeDetail component', () => {
  
  test('Test if grade detail component is rendered', async () => {
    const loginData = {
      email: "giulia.tesori@gmail.com",
      password: "easypass",
    };

    const response = await api.auth.login(loginData);
    
    if (response.data.token) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      shallow(
        <GradeDetail {...getRouterPropsForTest()} />
      );
    }
  });

});
