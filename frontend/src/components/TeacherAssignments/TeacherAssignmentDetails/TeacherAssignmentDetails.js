import React from 'react';
import {Icon, Modal, Button} from 'semantic-ui-react';
import moment from 'moment';
import './TeacherAssignmentDetails.scss';
import { FilePreview } from '../../FilePreview/FilePreview';
import mime from 'mime';

export const TeacherAssignmentDetails = (props) => (
  <Modal dimmer open className="assignment-detail" size="small">
    <Modal.Header>
      <span>{props.assignment ? props.assignment.Title : "none"}</span>
      <Icon onClick={props.onClose} className="close-icn" name="close" />
    </Modal.Header>
    <Modal.Content>
      <p>{props.assignment ? props.assignment.Description : "none"}</p>
      <p><b>Due date:</b> <span>{moment(props.assignment.DueDate).format('MMMM Do')}</span></p>
      {!!props.assignment.files.length && <p><b>Attachments: </b></p>}
      {props.assignment.files.map((file, index) => (
        <FilePreview 
          key={index}
          fileKey={file.Key}
          type={mime.getExtension(file.Type)} 
          name={file.Name}
          onDownload={props.onDownload}
        />
      ))}
    </Modal.Content>
    <Modal.Actions>
      <Button color="yellow" disabled={moment().isSameOrAfter(props.assignment.DueDate)} onClick={() => props.onUpdate(props.assignment)}>
        <Icon name='edit' /> Edit
      </Button>
      <Button negative disabled={moment().isSameOrAfter(props.assignment.DueDate)} onClick={() => props.onDelete(props.assignment)}>
        <Icon name='remove' /> Delete
      </Button>
    </Modal.Actions>    
  </Modal>  
);
