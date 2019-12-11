import React from 'react';
import {Icon, Modal, Button, ButtonGroup} from 'semantic-ui-react';
import './CommunicationInfo.scss';
import moment from 'moment';

export const CommunicationInfo = (props) => {
  const renderExpiration = () => {
    if (!props.isAdmin) {
      return null;
    }

    if (moment().startOf('day') > moment(props.communication.DueDate).startOf('day')) {
      return <span><b>Communication has expired</b></span>;
    }

    return <span><b>Expires at:</b> {moment(props.communication.DueDate).format('MMMM Do YYYY')}</span>;
  }

  return (
    <Modal
      className="communication-details" 
      size="small" 
      dimmer 
      open
      closeOnDimmerClick closeOnEscape 
      onClose={props.onClose}
    >
      <Modal.Header>
        <span>{props.communication.Title}</span>
        <Icon onClick={props.onClose} className="close-icn" name="close" />
      </Modal.Header>
      <Modal.Content>
        {!!props.communication.IsImportant && 
          <div class="important">
            <h3>This is an important communication</h3>
          </div>
        }
        <div className="description">
          <span>{props.communication.Description}</span>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <div className="valid-until" style={{float: 'left', marginTop: 8}}>
          {renderExpiration()}
        </div>
        {props.isAdmin &&
          <ButtonGroup>
            <Button onClick={() => props.onUpdate(props.communication)} color="vk">
              <Icon name='edit' /> Edit
            </Button>
            <Button.Or />
            <Button onClick={() => props.onDelete(props.communication.ID)} color="google plus">
              <Icon name='close' /> Delete
            </Button>
          </ButtonGroup>
        }
      </Modal.Actions>
    </Modal>
  ); 
}
