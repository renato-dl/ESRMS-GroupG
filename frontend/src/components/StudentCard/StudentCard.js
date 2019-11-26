import React from 'react';
import { Card, Image } from 'semantic-ui-react'
//import studentStubImage from '../../assets/images/stud5.jpg'
import studentStubImage from '../../assets/images/student-stub.png'
import studentStudFemaleImage from'../../assets/images/student-stub-female.jpg'

import './StudentCard.scss';
import moment from 'moment';

export const StudentCard = (props) => (
  <Card 
    className="student" 
    key={props.id} 
    onClick={props.onClick ? props.onClick : null}
  >
    <Image src={props.Gender=='M'?studentStubImage:studentStudFemaleImage} wrapped ui={false} />
    <Card.Content>
      <Card.Header className="studentCardHeader">{props.FirstName} {props.LastName}</Card.Header>
    </Card.Content>
    <Card.Content extra>
      <div className= "studentCardExtra"><b>SSN:&nbsp;&nbsp;&nbsp;</b> {props.SSN}</div>
      <div className= "studentCardExtra"><b>Birth Date:&nbsp;&nbsp;&nbsp;</b> {moment(props.BirthDate).format('LL')}</div>
    </Card.Content>
  </Card>
);
