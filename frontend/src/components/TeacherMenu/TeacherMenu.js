import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const TeacherMenu = (props) => (
  <>
    <Menu.Item className="menuStandard">
      <Link to="/student/:studentID/marks">
        <Icon name='sort numeric up' />
        I am teacher
      </Link>
    </Menu.Item>
  </>
);
