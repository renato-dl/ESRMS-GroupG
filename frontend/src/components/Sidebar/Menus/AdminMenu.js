import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const AdminMenu = (props) => (
  <>
    <Menu.Item >
      <span>
        <br/>
        <Icon name='address book outline' size="big" />
        Secretary Officer 
        <br/><br/>
      </span>
    </Menu.Item>

    <Menu.Item as={Link} to='/admin/enrollStudents'>
      <Icon name='child' />
      Students
    </Menu.Item>
    {/* <Menu.Item as={Link} to='/admin/configParent'>
      <Icon name='users' />
      Parents' Access
    </Menu.Item> */}
    <Menu.Item as={Link} to='/admin/ClassComposition'>
      <Icon name='linode' />
      Class Compositions
    </Menu.Item>
    <Menu.Item as={Link} to='/admin/TeacherClasses'>
      <Icon name='id card outline' />
      Teacher-Class Associations
    </Menu.Item>
    <Menu.Item as={Link} to='/admin/communications'>
      <Icon name='bullhorn' />
      Communications
    </Menu.Item>
    {/* <Menu.Item as={Link} to='/accounts'>
      <Icon name='wrench' />
      Internal Accounts Setup
    </Menu.Item> */}
    <Menu.Item as={Link} to='/admin/timetables'>
      <Icon name='clock outline' />
      Class Timetables
    </Menu.Item>
  </>
);