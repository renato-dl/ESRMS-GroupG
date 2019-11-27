import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const TeacherMenu = (props) => {
  const id = localStorage.getItem('teacherID');

  return (
    <>
      <Menu.Item as={Link} to={`/teacher/${id}`}>
        <span>
          <br/>
          <Icon name='user' size="big" />
          TEACHER 
          <br/><br/>
        </span>
      </Menu.Item>
      <Menu.Item as={Link} to={`/teacher/${id}`}>
        <Icon name='book' />
        Subjects
      </Menu.Item>
      <Menu.Item as={Link} to='/teacher/marks'>
        <Icon name='sort numeric up' />
        Marks
      </Menu.Item>
      <Menu.Item as={Link} to='/teacher/presence'>
        <Icon name='check' />
        Present/Absent records
      </Menu.Item>
    </>
  );
}