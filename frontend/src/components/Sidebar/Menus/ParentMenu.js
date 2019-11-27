import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const ParentMenu = (props) => {  
  //const id = localStorage.getItem('parentID');

  return (
    <>
      <Menu.Item as={Link} to={`/parent`}>
        <span>
          <br/>
          <Icon name='child' size="big" /> Children
          <br/><br/>
        </span>
      </Menu.Item>

      {/* <Menu.Item as={Link} to='/parent/student/:studentID/marks'>
        <Icon name='sort numeric up' />
        Grades
      </Menu.Item> */}

      <Menu.Item as={Link} to="/parent/student/:studentID/homeworks">
        <Icon name='home'/>
        Homeworks
      </Menu.Item>
      
      <Menu.Item as={Link} to="/parent/student/:studentID/attendance">
        <Icon name='calendar check outline'/>
        Attendance
      </Menu.Item>

      <Menu.Item as={Link} to="/parent/student/:studentID/study-plan">
        <Icon name='file alternate outline'/>
        Study Plan
      </Menu.Item>
    </>
  )
};
