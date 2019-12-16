import React from 'react';
import {Icon, Modal} from 'semantic-ui-react';
import moment from 'moment';
import './AssignmentDetails.scss';
import { FilePreview } from '../../FilePreview/FilePreview';
import {api} from '../../../services/api'
import fileDownload from 'js-file-download/file-download';

export const AssignmentDetails = (props) => {
  console.log(props);

  const handleDownload = async (fileName) => {
    const response = await api.parent.getAssignmentFile(fileName);
    fileDownload(response.data, fileName);
  };

  return (
    <Modal dimmer open className="assignment-detail" size="small">
      <Modal.Header>
        <span>Assignment details</span>
        <Icon onClick={props.onClose} className="close-icn" name="close" />
      </Modal.Header>
      <Modal.Content>
        <h3>Subject: <span>{props.assignment.Name}</span></h3>
        <h3>Assignment title: <span>{props.assignment.Title}</span></h3>
        <h3>Assignment description: <span>{props.assignment.Description}</span></h3>
        <h3>Due date: <span>{moment(props.assignment.DueDate).format('MMMM Do')}</span></h3>
        {props.assignment.AttachmentFile && 
          <>
            <h3>Attachments:</h3>
            <FilePreview 
              type={props.assignment.AttachmentFile.split('.').pop()} 
              name={props.assignment.AttachmentFile}
              onDownload={() => handleDownload(props.assignment.AttachmentFile)}
            />
          </>
        }
      </Modal.Content>
      {/* <Modal.Actions>
        <Button positive onClick={props.onClose}>
          <Icon name='checkmark' /> Close
        </Button>
      </Modal.Actions> */}
    </Modal>
  );
};
