import React from 'react';
import {Icon, Modal} from 'semantic-ui-react';
import moment from 'moment';
import './AssignmentDetails.scss';
import { FilePreview } from '../../FilePreview/FilePreview';
import {api} from '../../../services/api'
import fileDownload from 'js-file-download/file-download';
import mime from 'mime';

export const AssignmentDetails = (props) => {
  
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
        {!!props.assignment.files.length && 
          <>
            <h3>Attachments:</h3>
            {props.assignment.files.map((file) => (
              <FilePreview 
                type={mime.getExtension(file.Type)} 
                name={file.Name} 
                onDownload={() => handleDownload(file.Key)}
              />
            ))}
          </>
        }
      </Modal.Content>
    </Modal>
  );
};
