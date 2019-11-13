import React from 'react';
import { Card, Image } from 'semantic-ui-react'
import studentStubImage from '../../assets/images/student-stub.png'
import './StudentCard.scss';

export const StudentCard = (props) => (
  <Card 
    className="student" 
    key={props.id} 
    onClick={props.onClick ? props.onClick : null}
  >
    <Image src={studentStubImage} wrapped ui={false} />
    <Card.Content>
      <Card.Header>{props.FirstName} {props.LastName}</Card.Header>
    </Card.Content>
    <Card.Content extra>
      <div>SSN: {props.SSN}</div>
      <div>BirthDate: {new Date(props.BirthDate).toDateString()}</div>
    </Card.Content>
  </Card>
);
