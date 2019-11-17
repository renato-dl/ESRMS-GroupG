import React from 'react';
import { Menu, Segment, Sidebar } from 'semantic-ui-react';
import '../../assets/styles/global.scss';
import { ParentMenu } from '../ParentMenu/ParentMenu';
import { TeacherMenu } from '../TeacherMenu/TeacherMenu';
import { ApplicationStoreContext } from '../../store';
import { AdminMenu } from '../AdminMenu/AdminMenu';


const Parent = false;
const Teacher = false;
const Admin = true;

export const AppSidebar = (props) => {
  return (
<Sidebar.Pushable as={Segment} 
  className="mySidebar">
  <Sidebar
    as={Menu}
    animation='slide along'
    //icon='labeled'
    inverted
    //left
    vertical
    sidebar = "true"
    menu = "true"
    visible
    //width = "thin"
  >
    {Parent && <ParentMenu />}
    {Teacher && <TeacherMenu />}
    {Admin && <AdminMenu />}

  </Sidebar>

  <Sidebar.Pusher>
    <Segment basic>
      {/* <Header as='h3' className="contentHeader">Application Content Header</Header> */}
      {props.children}
    </Segment>
  </Sidebar.Pusher>
</Sidebar.Pushable>
  )
}
