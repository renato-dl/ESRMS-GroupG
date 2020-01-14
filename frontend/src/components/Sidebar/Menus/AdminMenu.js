import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const AdminMenu = (props) => (
  <>
    <Menu.Item >
      <span>
        <br/>
        <Icon className='address book outline' size="big" />
        Secretary Officer 
        <br/><br/>
      </span>
    </Menu.Item>

    <Menu.Item as={Link} to='/admin/enrollStudents'>
      <Icon className='child' />
      Students
    </Menu.Item>
    {/* <Menu.Item as={Link} to='/admin/configParent'>
      <Icon name='users' />
      Parents' Access
    </Menu.Item> */}
    <Menu.Item as={Link} to='/admin/ClassComposition'>
      <Icon className='linode' />
      Class Compositions
    </Menu.Item>
    <Menu.Item as={Link} to='/admin/timetables'>
      <Icon className='clock outline' />
      Class Timetables
    </Menu.Item>
    <Menu.Item as={Link} to='/admin/TeacherClasses'>
      <Icon className='exchange icon' />
      Teacher-Class Associations
    </Menu.Item>
    <Menu.Item as={Link} to='/admin/communications'>
      <Icon className='bullhorn' />
      Communications
    </Menu.Item>
    {/* <Menu.Item as={Link} to='/accounts'>
      <Icon name='wrench' />
      Internal Accounts Setup
    </Menu.Item> */}
  </>
);