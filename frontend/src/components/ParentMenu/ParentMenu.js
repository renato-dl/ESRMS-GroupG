import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const ParentMenu = (props) => (
  <>
    <Menu.Item className="menuChildItem">
      <Link to="/parent">
        <span>
          <br/>
          <Icon name='child' size="big" />
          ChildName 
          <br/>
          <br/>
        </span>
        {/* <span>
          <Icon name='user circle big' />
          Student
          <br/><br/>
          Name Surname
          <br/>
        </span> */}
      </Link>
      
    </Menu.Item>

    <Menu.Item className="menuStandard">
      <Link to="/student/:studentID/marks">
        <Icon name='sort numeric up' />
        Grades
      </Link>
    </Menu.Item>
    <Menu.Item className="menuStandard">
      <Link to="/student/:studentID/homeworks">
        <Icon name='home' />
        Homeworks
      </Link>
    </Menu.Item>
    
    <Menu.Item className="menuStandard">
      <Link to="/student/:studentID/homeworks">
        <Icon name='calendar check outline' />
        Attendance
      </Link>
    </Menu.Item>
    <Menu.Item className="menuStandard">
      <Link to="/student/:studentID/homeworks">
        <Icon name='file alternate outline' />
        Study Plan
      </Link>
    </Menu.Item>
  </>
);
