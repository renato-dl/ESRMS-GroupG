import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const ParentMenu = (props) => (
  <>
    <Menu.Item as={Link} to="/parent">
      <span>
        <br/>
        <Icon name='child' size="big" />
        ChildName 
        <br/><br/>
      </span>
    </Menu.Item>

    <Menu.Item as={Link} to='/parent/student/:studentID/marks'>
      <Icon name='sort numeric up' />
      Grades
    </Menu.Item>

    <Menu.Item as={Link} to="/parent/student/:studentID/homeworks">
      <Icon name='home'/>
      Homeworks
    </Menu.Item>
    
    <Menu.Item as={Link} to="/parent/student/:studentID/homeworks">
      <Icon name='calendar check outline'/>
      Attendance
    </Menu.Item>

    <Menu.Item as={Link} to="/parent/student/:studentID/homeworks">
      <Icon name='file alternate outline'/>
      Study Plan
    </Menu.Item>
  </>
);
