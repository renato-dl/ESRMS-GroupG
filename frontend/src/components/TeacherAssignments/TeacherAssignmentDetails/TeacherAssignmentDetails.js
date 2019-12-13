import React from 'react';
import {Icon, Modal, Button} from 'semantic-ui-react';
import moment from 'moment';
import './TeacherAssignmentDetails.scss';

export const TeacherAssignmentDetails = (props) => (
  <Modal dimmer open className="assignment-detail" size="small">
    <Modal.Header>
      <span>{props.assignment.Title}</span>
      <Icon onClick={props.onClose} className="close-icn" name="close" />
    </Modal.Header>
    <Modal.Content>
      <p>{props.assignment.Description}</p>
      <p><b>Due date:</b> <span>{moment(props.assignment.DueDate).format('MMMM Do')}</span></p>
    </Modal.Content>
    <Modal.Actions>
      <Button positive onClick={props.onClose}>
        <Icon name='checkmark' /> Close
      </Button>
    </Modal.Actions>
  </Modal>
);
