import React from 'react'
import { Button, Modal, Icon} from 'semantic-ui-react';
import '../admin_StudentsEnrollment.scss'
import "react-datepicker/dist/react-datepicker.css";

export class DeleteStudentModal extends React.Component {
  render() {
    return (
      <Modal dimmer open className="grade-detail" size="small">
        <Modal.Header>
          <span>Delete Student</span>
          <Icon onClick={this.props.onClose} className="archive deleleIcon" name="close" />
        </Modal.Header>
        <Modal.Content>
          <h3>
            Are you sure you want to delete {this.props.student.FirstName} {this.props.student.LastName}?
          </h3>
        </Modal.Content>
        <Modal.Actions>
        <Button basic color='red' onClick={this.props.onClose}>
            <Icon name='remove' /> No
        </Button>
        <Button color='green' onClick={this.props.onDelete}>
            <Icon name='checkmark' /> Yes
        </Button>
        </Modal.Actions>      
      </Modal>    
    );
  }
}
