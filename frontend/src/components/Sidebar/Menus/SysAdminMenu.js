import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const SysAdminMenu = (props) => (
  <>
    <Menu.Item as={Link} to="/sysadmin">
      <span>
        <br/>
        <Icon name='cog' size="big" />
        SYSTEM &nbsp; ADMIN
        <br/><br/>
      </span>
    </Menu.Item>

    <Menu.Item as={Link} to='/sysadmin/accounts'>
      <Icon name='wrench' />
      Internal Accounts Setup
    </Menu.Item>
  </>
);