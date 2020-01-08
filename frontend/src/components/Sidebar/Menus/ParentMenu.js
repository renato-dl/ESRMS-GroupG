import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export const ParentMenu = (props) => {  
  const selectedChildID = props.selectedStudent.ID;
  const child = JSON.parse(localStorage.getItem('selectedChild'));
  
  return (
      <>
        <Menu.Item as={Link} to={`/parent`}>
          <span>
            <br/>
            <Icon name='child' size="big" /> Select child
            <br/><br/>
          </span>
        </Menu.Item>
        {child &&
        <Menu.Item style={{textAlign:"center",  color:"#DBCA47", height:"35px", padding:"5px", fontSize: "20px",  borderLeft:" 2px solid #DBCA47"}}>
          <span>
          <Icon name='student' size="small" />&nbsp;{child.FirstName} {child.LastName}
          </span>
        </Menu.Item>
        }

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
            
            <Menu.Item as={Link} to={`/parent/student/${selectedChildID}/attendance`}>
              <Icon name='calendar check outline'/>
              Attendance
            </Menu.Item>

            <Menu.Item as={Link} to={`/parent/student/${selectedChildID}/note`}>
              <Icon name='sticky note outline'/>
              Notes
            </Menu.Item>
          </>
        }

        <Menu.Item as={Link} to={`/parent/communications`}>
          <Icon name='bullhorn'/>
          Communications
        </Menu.Item>
      </>
    )
};
