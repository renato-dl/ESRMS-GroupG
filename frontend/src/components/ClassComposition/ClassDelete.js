import React from 'react'
import { Button, Modal, Icon} from 'semantic-ui-react';
import './ClassComposition.scss'
import "react-datepicker/dist/react-datepicker.css";

export class ClassDelete extends React.Component {
  render() {
    return (
      <Modal dimmer open className="grade-detail" size="small">
        <Modal.Header>
          <span>Delete class</span>
          <Icon onClick={this.props.onClose} className="archive deleleIcon" name="close" />
        </Modal.Header>
        <Modal.Content>
          <h3>
            Are you sure you want to delete class {this.props.class ? this.props.class.Name : 'none'}?
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
