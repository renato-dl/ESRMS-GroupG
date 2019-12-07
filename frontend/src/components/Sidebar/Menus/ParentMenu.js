import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const ParentMenu = (props) => {  
  const selectedChildID = props.selectedStudent.ID;

  return (
      <>
        <Menu.Item as={Link} to={`/parent`}>
          <span>
            <br/>
            <Icon name='child' size="big" /> Children
            <br/><br/>
          </span>
        </Menu.Item>

        {!!selectedChildID && 
          <>
          <Menu.Item as={Link} to={`/parent/student/${selectedChildID}/marks`}>
              <Icon name='sort numeric up'/>
              Grades
            </Menu.Item>

            <Menu.Item as={Link} to={`/parent/student/${selectedChildID}/assignments`}>
              <Icon name='home'/>
              Assignments
            </Menu.Item>
            
            {/* <Menu.Item as={Link} to={`/parent/student/${selectedChildID}/attendance`}>
              <Icon name='calendar check outline'/>
              Attendance
            </Menu.Item>

            <Menu.Item as={Link} to={`/parent/student/${selectedChildID}/study-plan`}>
              <Icon name='file alternate outline'/>
              Study Plan
            </Menu.Item> */}
          </>
        }
      </>
    )
};
