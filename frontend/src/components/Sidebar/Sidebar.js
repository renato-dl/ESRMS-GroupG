import React from 'react';
import { Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';
import '../../assets/styles/global.scss';
import { ParentMenu } from '../ParentMenu/ParentMenu';
import { TeacherMenu } from '../TeacherMenu/TeacherMenu';

const trigger = (
  <span><Icon name='user' /></span>
)

const options = [
  {
    key: 'user',
    text: (
      <span>
        Signed in as <strong>Bob Smith</strong>
      </span>
    ),
    disabled: true,
  },
  { key: 'childProfile', text: 'Switch Child' },
  { key: 'sign-out', text: 'Sign Out' },
]

const PSidebar = true;

export const AppSidebar = (props) => (
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
    {PSidebar && <ParentMenu />}

    {!PSidebar && <TeacherMenu />}

  </Sidebar>

  <Sidebar.Pusher>
    <Segment basic>
      {/* <Header as='h3' className="contentHeader">Application Content Header</Header> */}
      {props.children}
    </Segment>
  </Sidebar.Pusher>
</Sidebar.Pushable>
);
