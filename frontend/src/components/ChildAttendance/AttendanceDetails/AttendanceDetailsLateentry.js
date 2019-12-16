import React from 'react';
import {Icon, Modal, Button} from 'semantic-ui-react';
import moment from 'moment';
import './AttendanceDetails.scss';

export const AttendanceDetailsLateentry = (props) => (
  <Modal dimmer open className="attendance-detail" size="small">
    <Modal.Header>
      <span>Attendance details</span>
      <Icon onClick={props.onClose} className="close-icn" name="close" />
    </Modal.Header>
    <Modal.Content>
      <h3>Date: <span>{moment(props.attendance.Date).format('MMMM Do')}</span></h3>
      <h3>Status: <span>Late Entry</span></h3>
      <h3>Entry Teacher Name: <span>{props.attendance.EntryTeacherName}</span></h3>
      <h3>LateEntry: <span>{props.attendance.LateEntry=='1h'?'With in 10 mins':'Second hour'}</span></h3>
      </Modal.Content>
  </Modal>
);
