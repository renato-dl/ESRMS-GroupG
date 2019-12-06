import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import GradeDelete from '../components/TeacherGrade/GradeDetail/GradeDelete';
import { api } from '../services/api';

describe('Testing GradeDelete component', () => {
  
  test('Test if grade delete component is rendered', async () => {
    const loginData = {
      email: "giulia.tesori@gmail.com",
      password: "easypass",
    };

    const response = await api.auth.login(loginData);
    
    if (response.data.token) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      shallow(
        <GradeDelete {...getRouterPropsForTest()} />
      );
    }
  });

});
