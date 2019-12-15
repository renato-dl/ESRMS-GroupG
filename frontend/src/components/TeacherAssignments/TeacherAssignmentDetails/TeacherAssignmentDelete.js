import React, { Component } from 'react';
import './TeacherAssignmentDetails.scss';
import {Button, Modal, Icon} from 'semantic-ui-react';
import moment from 'moment';
import * as toastr from 'toastr';
import {api} from '../../../services/api';

export class TeacherAssignmentDelete extends Component {
  state = {
    gradeId: null,
    title: null,
    description: null,
    duedate: null,
    attachment: null,
    isSaving: false
  };

  componentDidMount() {
    const {assignment} = this.props;
    if(assignment){
      this.setState({
        id: assignment.ID,
        title: assignment.Title,
        description: assignment.Description,
        duedate: new Date(assignment.DueDate)
      });
    }    
  };

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const request = {
        ID: this.state.id
      }
      await api.teacher.deleteAssignment(request);
      toastr.success(`Assignment deleted successfully.`);           
    } catch (e) {
      this.setState({isSaving: false});
      return toastr.error(e);
    }

    this.setState({isSaving: false});
    this.props.onSave();
  };
  
  render() {
    return (
      <Modal dimmer open className="assignment-detail" size="small">
        <Modal.Header>
          <span>Delete Assignment</span>
          <Icon onClick={this.props.onDeleteClose} className="archive" name="close" />
        </Modal.Header>
        <Modal.Content>
        <h3>
            Are you sure you want to delete this assignment?
        </h3>
        <p><b>Title:</b> {this.state.title}</p>
        <p><b>Description:</b> {this.state.description}</p>
        <p><b>Attachment:</b> {this.state.attachment}</p>
        <p><b>Due date:</b> { moment(this.state.duedate).format('LL')}</p>
        </Modal.Content>
        <Modal.Actions>
        <Button basic color='red' onClick={this.props.onDeleteClose}>
            <Icon name='remove' /> No
        </Button>
        <Button color='green' onClick={this.onSave}>
            <Icon name='checkmark' /> Yes
        </Button>
        </Modal.Actions>      
      </Modal>                    
    )                 
  }
}

export default TeacherAssignmentDelete
