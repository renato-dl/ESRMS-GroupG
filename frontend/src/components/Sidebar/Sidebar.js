import React from 'react';

import { Header, Icon, Image, Menu, Segment, Sidebar, Dropdown } from 'semantic-ui-react';

import '../../assets/styles/global.scss';
import {Container} from 'semantic-ui-react';
import {Switch, Route} from 'react-router-dom';
import { Parent } from '../../containers/Parent/Parent';
import { NotFound } from '../../containers/NotFound/NotFound';
import { Student } from '../../containers/Student/Student';
import {Marks}  from'../../containers/Marks/Marks';

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


export const AppSidebar = ({ animation, direction, visible, className }) => (
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

    <Menu.Item as='a' href="/parent" className="menuChildItem">
      
      <span>
        <br/>
        <Icon name='child' size="big" />
        ChildName 
        <br/>
        <br/>
      </span>
      {/* <span>
        <Icon name='user circle big' />
        Student
        <br/><br/>
        Name Surname
        <br/>
      </span> */}
      
    </Menu.Item>

    <Menu.Item as='a' href= "/student/:studentID/marks" className="menuStandard">

        <Icon name='sort numeric up' />
        Grades

    </Menu.Item>
    <Menu.Item as='a' href="/student/:studentID/homeworks" className="menuStandard">
      <Icon name='home' />
      Homeworks
    </Menu.Item>
    
    <Menu.Item as='a' href="/student/:studentID/homeworks" className="menuStandard">
      <Icon name='calendar check outline' />
      Attendance
    </Menu.Item>
    <Menu.Item as='a' href="/student/:studentID/homeworks" className="menuStandard">
      <Icon name='file alternate outline' />
      Study Plan
    </Menu.Item>
  </Sidebar>

  <Sidebar.Pusher>
    <Segment basic>
      {/* <Header as='h3' className="contentHeader">Application Content Header</Header> */}
      <div>
          
          <Switch>
            
            <Route exact path="/parent" component={Parent} />
            <Route exact path="/student/:studentID" component={Student} />
            <Route exact path="/student/:studentID/marks/"component={Marks}/>
            <Route path="*" component={NotFound} />

          </Switch>
          
        </div>
    </Segment>
  </Sidebar.Pusher>
</Sidebar.Pushable>
);
