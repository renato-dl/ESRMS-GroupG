import React from 'react';
import { Menu, Segment, Sidebar } from 'semantic-ui-react';
import '../../assets/styles/global.scss';

import { ParentMenu } from './Menus/ParentMenu';
import { TeacherMenu } from './Menus/TeacherMenu';
import { AdminMenu } from './Menus/AdminMenu';
import { SysAdminMenu } from './Menus/SysAdminMenu';


export const AppSidebar = (props) => {
  const loc = window.location.pathname;
  
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
        //onHide = 
        //onVisible
      >

        {loc.indexOf("/parent") !== -1 && <ParentMenu />}
        {loc.indexOf("/teacher") !== -1 && <TeacherMenu />}
        {loc.indexOf("/admin") !== -1 && <AdminMenu />}
        {loc.indexOf("/sysadmin") !== -1 && <SysAdminMenu />}


      </Sidebar>

      <Sidebar.Pusher>
        <Segment basic className= {props.visibility ? 'customSegment Open' :  'customSegment Closed'}>
          {props.children}
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}
