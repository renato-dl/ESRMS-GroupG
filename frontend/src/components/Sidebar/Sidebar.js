import React from 'react';
import { Menu, Segment, Sidebar } from 'semantic-ui-react';
import '../../assets/styles/global.scss';

import { ParentMenu } from './Menus/ParentMenu';
import { TeacherMenu } from './Menus/TeacherMenu';
import { AdminMenu } from './Menus/AdminMenu';

const loc = window.location.pathname;

export const AppSidebar = (props) => {

  const StyleClosed = {
      width: "100%",
      transition: "width 0.5s"
  }
  const StyleOpen = {
    width: "85%",
    transition: "width 0.5s"
  }

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

      </Sidebar>

      <Sidebar.Pusher>
        <Segment basic className="customSegment" style = {props.visibility ? StyleOpen : StyleClosed}>
          {props.children}
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}
