import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const AdminMenu = (props) => (
  <>
    <Menu.Item as={Link} to="/admin">
      <span>
        <br/>
        <Icon name='cog' size="big" />
        ADMINISTRATOR 
        <br/><br/>
      </span>
    </Menu.Item>

    <Menu.Item as={Link} to='/admin/configParent'>
      <Icon name='users' />
      Parents of Students
    </Menu.Item>
    <Menu.Item as={Link} to='/enrollment'>
      <Icon name='child' />
      Students Enrollment
    </Menu.Item>
    <Menu.Item as={Link} to='/admin/Class_composition'>
      <Icon name='linode' />
      Class Composition
    </Menu.Item>
    <Menu.Item as={Link} to='/accounts'>
      <Icon name='wrench' />
      Internal Accounts Setup
    </Menu.Item>
  </>
);