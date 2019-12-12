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
      <h3>Date: <span>{props.attendance.Date}</span></h3>
      <h3>Status: <span>{props.attendance.title}</span></h3>
      <h3>LateEntry: <span>{props.attendance.LateEntry}</span></h3> 
      <h3>EntryTeacherName: <span>{props.attendance.EntryTeacherName}</span></h3>
      <h3>EarlyExit: <span>{props.attendance.EarlyExit}</span></h3>
      <h3>ExitTeacherName: <span>{props.attendance.ExitTeacherName}</span></h3>
    </Modal.Content>
    <Modal.Actions>
      <Button positive onClick={props.onClose}>
        <Icon name='checkmark' /> Close
      </Button>
    </Modal.Actions>
  </Modal>
);
