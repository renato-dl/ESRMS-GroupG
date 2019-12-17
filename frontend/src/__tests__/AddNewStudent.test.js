import React from 'react';
import {AddNewStudent} from '../components/adminComponents/SudentsEntrollment/AddNewStudent/AddNewStudent';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import FormStudentDetails from '../components/adminComponents/SudentsEntrollment/AddNewStudent/Details/FormStudentDetails';
import FormParentDetails from '../components/adminComponents/SudentsEntrollment/AddNewStudent/Details/FormParentDetails';

describe('Testing of AddNewStudent component (admin page)', () => {
  
  test('Test if components for Enroll a Student are rendered', () => {
    shallow(
      <AddNewStudent {...getRouterPropsForTest()} >
          <FormStudentDetails {...getRouterPropsForTest()}/>
         <FormParentDetails {...getRouterPropsForTest()}/>
      </AddNewStudent>
    );
  });

});
