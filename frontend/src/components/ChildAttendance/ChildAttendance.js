import React from 'react';
import { api } from '../../services/api';
import './ChildAttendance.scss';

import {
  Table,
  Button,
  Icon,
  Container,
  Modal
} from 'semantic-ui-react'
import moment from 'moment';
import { NoData } from '../NoData/NoData';

export class ChildAttendance extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
      }
    }

    render(){
      return (
        <Modal dimmer open className="attendance-detail" size="small">
        <Modal.Header>
          <span>Attendance details</span>
          {/* <Icon onClick={props.onClose} className="close-icn" name="close" /> */}
        </Modal.Header>
        <Modal.Content>
          {/* <h3>Subject: <span>{props.assignment.Name}</span></h3>
          <h3>Assigment title: <span>{props.assignment.Title}</span></h3>
          <h3>Assignment description: <span>{props.assignment.Description}</span></h3>
          <h3>Due date: <span>{moment(props.assignment.DueDate).format('MMMM Do')}</span></h3> */}
        </Modal.Content>
        {/* <Modal.Actions>
          <Button positive onClick={props.onClose}>
            <Icon name='checkmark' /> Close
          </Button>
        </Modal.Actions> */}
      </Modal>
      )
    }
}
