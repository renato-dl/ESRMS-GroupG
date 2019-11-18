import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const TeacherMenu = (props) => (
  <>
    <Menu.Item as={Link} to="/teacher">
      <span>
        <br/>
        <Icon name='user' size="big" />
        TEACHER 
        <br/><br/>
      </span>
    </Menu.Item>
    <Menu.Item as={Link} to='/teacher'>
      <Icon name='book' />
      Subjects
    </Menu.Item>
    <Menu.Item as={Link} to='/teacher/abc'>
      <Icon name='sort numeric up' />
      Marks
    </Menu.Item>
    <Menu.Item as={Link} to='/teacher/abc'>
      <Icon name='check' />
      Present/Absent records
    </Menu.Item>
  </>
);