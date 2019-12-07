import React from 'react';
import {Icon, Modal, Button} from 'semantic-ui-react';
import moment from 'moment';
import './AttendanceDetails.scss';

export const AttendanceDetails = (props) => (
  <Modal dimmer open className="attendance-detail" size="small">
    <Modal.Header>
      <span>Attendance details</span>
      <Icon onClick={props.onClose} className="close-icn" name="close" />
    </Modal.Header>
    <Modal.Content>
      <h3>Subject: <span>{props.attendance.Name}</span></h3>
      <h3>Assigment title: <span>{props.attendance.Title}</span></h3>
      <h3>Assignment description: <span>{props.attendance.Description}</span></h3>
      <h3>Due date: <span>{moment(props.attendance.DueDate).format('MMMM Do')}</span></h3>
    </Modal.Content>
    <Modal.Actions>
      <Button positive onClick={props.onClose}>
        <Icon name='checkmark' /> Close
      </Button>
    </Modal.Actions>
  </Modal>
);
