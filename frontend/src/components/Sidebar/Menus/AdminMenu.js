import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const AdminMenu = (props) => (
  <>
    <Menu.Item as={Link} to="/admin">
      <span>
        <br/>
        <Icon name='address book outline' size="big" />
        ADMIN Officer 
        <br/><br/>
      </span>
    </Menu.Item>

    <Menu.Item as={Link} to='/admin/enrollStudents'>
      <Icon name='child' />
      Students
    </Menu.Item>
    <Menu.Item as={Link} to='/admin/configParent'>
      <Icon name='users' />
      Parents' Access
    </Menu.Item>
    <Menu.Item as={Link} to='/admin/Class_composition'>
      <Icon name='linode' />
      Class Compositions
    </Menu.Item>
    {/* <Menu.Item as={Link} to='/accounts'>
      <Icon name='wrench' />
      Internal Accounts Setup
    </Menu.Item> */}
  </>
);