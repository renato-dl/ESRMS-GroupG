import React, {useContext} from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import { ApplicationStoreContext } from '../../store';

export const ParentMenu = (props) => {
  const context = useContext(ApplicationStoreContext);
  const {selectedStudent} = context;
  console.log(selectedStudent);
  return (
  <>
    <Menu.Item as={Link} to="/parent">
      <span>
        <br/>
        <Icon name='child' size="big" />
        {selectedStudent ? selectedStudent.FirstName + ' ' + selectedStudent.LastName : 'Children'} 
        <br/><br/>
      </span>
    </Menu.Item>

    {/* <Menu.Item as={Link} to='/parent/student/:studentID/marks'>
      <Icon name='sort numeric up' />
      Grades
    </Menu.Item> */}

    <Menu.Item as={Link} to="/parent/student/:studentID/abcdef">
      <Icon name='home'/>
      Homeworks
    </Menu.Item>
    
    <Menu.Item as={Link} to="/parent/student/:studentID/abcdef">
      <Icon name='calendar check outline'/>
      Attendance
    </Menu.Item>

    <Menu.Item as={Link} to="/parent/student/:studentID/abcdef">
      <Icon name='file alternate outline'/>
      Study Plan
    </Menu.Item>
  </>
)};
