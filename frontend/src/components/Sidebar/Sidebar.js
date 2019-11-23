import React from 'react';
import { Menu, Segment, Sidebar } from 'semantic-ui-react';
import '../../assets/styles/global.scss';

import { ParentMenu } from '../ParentMenu/ParentMenu';
import { TeacherMenu } from '../TeacherMenu/TeacherMenu';
import { AdminMenu } from '../AdminMenu/AdminMenu';

const loc = window.location.pathname;

export const AppSidebar = (props) => {
  return (
    <Sidebar.Pushable as={Segment} className="mySidebar">
      <Sidebar
        as={Menu}
        animation='slide along'
        inverted
        vertical
        sidebar = "true"
        menu = "true"
        visible = {props.visibility}
        
      >

        {loc.indexOf("/parent") !== -1 && <ParentMenu />}
        {loc.indexOf("/teacher") !== -1 && <TeacherMenu />}
        {loc.indexOf("/admin") !== -1 && <AdminMenu />}

      </Sidebar>

      <Sidebar.Pusher>
        <Segment basic className="customSegment">
          {props.children}
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}
