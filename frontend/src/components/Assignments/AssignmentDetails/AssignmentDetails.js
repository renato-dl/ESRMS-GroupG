import React from 'react';
import {Icon, Modal, Button} from 'semantic-ui-react';
import moment from 'moment';
import './AssignmentDetails.scss';

export const AssignmentDetails = (props) => (
  <Modal dimmer open className="assignment-detail" size="small">
    <Modal.Header>
      <span>Assignment details</span>
      <Icon onClick={props.onClose} className="close-icn" name="close" />
    </Modal.Header>
    <Modal.Content>
      <h3>Subject: <span>{props.assignment.Name}</span></h3>
      <h3>Assigment title: <span>{props.assignment.Title}</span></h3>
      <h3>Assignment description: <span>{props.assignment.Description}</span></h3>
      <h3>Due date: <span>{moment(props.assignment.DueDate).format('MMMM Do')}</span></h3>
    </Modal.Content>
    <Modal.Actions>
      <Button positive onClick={props.onClose}>
        <Icon name='checkmark' /> Close
      </Button>
    </Modal.Actions>
  </Modal>
);
