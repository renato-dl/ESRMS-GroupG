import React from 'react'
import {Header, Button, Modal, Icon} from 'semantic-ui-react'
import "react-datepicker/dist/react-datepicker.css";

export class DeleteStudentModal extends React.Component {
  render() {
    return (
      <Modal dimmer open className="grade-detail" size="small">
        <Header icon='archive' content='Delete Student' onClick={this.onClose}/>
        <Modal.Content>
          <p>
            Are you sure you want to delete {this.props.student.FirstName} {this.props.student.LastName}?
          </p>
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
