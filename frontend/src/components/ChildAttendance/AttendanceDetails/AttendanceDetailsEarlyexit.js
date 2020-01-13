import React from 'react';
import {Icon, Modal} from 'semantic-ui-react';
import moment from 'moment';
import './AttendanceDetails.scss';

export const AttendanceDetailsEarlyexit = (props) => (
  <Modal dimmer open className="attendance-detail" size="tiny">
    <Modal.Header>
      <span>Attendance details</span>
      <Icon onClick={props.onClose} className="close-icn" name="close" />
    </Modal.Header>
    <Modal.Content>
      <h3>Date: <span>{moment(props.attendance.Date).format('MMMM Do')}</span></h3>
      {/* <h3>Status: <span>Early Exit</span></h3> */}
      <h3>Early Exit: <span>{props.attendance.EarlyExit}</span></h3>
      <h3>Registered by teacher: <span>{props.attendance.ExitTeacherName}</span></h3>
     </Modal.Content>
  </Modal>
);
