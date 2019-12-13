import React, { Component } from 'react';
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TeacherAssignmentDetails.scss";
import {api} from '../../../services/api';
import * as toastr from 'toastr';

export class TeacherAssignment extends Component {
  state = {
    id: null,
    title: '',
    description: '',
    duedate: new Date(),
    classId: '',
    subjectId: '',
    isSaving: false
  };

  componentDidMount() {
    const {assignment} = this.props;

    const subject = this.props.subjectId;
    const classID = this.props.classId;

    this.setState({subjectId: subject, classId: classID});

    if (assignment) {
      this.setState({
        id: assignment.ID,
        title: assignment.Title,
        description: assignment.Description,
        duedate: new Date(assignment.DueDate)
      });
    }
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({[name]: value});
  };

  handleDateChange = (date) => {
    this.setState({date});
  };

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});
    const {params} = this.props.match;

    try {
      const assignmentData = {
        topicId: this.state.id,
        classId: this.state.classId,
        subjectId: params.subjectId,
        topicTitle: this.state.title,
        topicDescription: this.state.description,
        topicDate: this.state.duedate.toUTCString()
      };

    // //   if(!this.state.id) {
    // //     await api.teacher.saveTopic(topicData);
    // //     toastr.success(`Topic ${this.state.topicID ? 'updated' : 'added'} successfully.`);
    // //   } else {
    // //     const reqResult = await api.teacher.updateTopic(topicData);  
        
    // //     if (reqResult.data.Success) {
    // //       toastr.success('Topic updated successfully.');
    // //     } else {
    // //       toastr.error(reqResult.data.Message);
    // //       this.setState({isSaving: false});
    // //       return;
    // //     }
    //   }
    } catch (e) {
      this.setState({isSaving: false});
      return toastr.error(e);
    }

    this.setState({isSaving: false});
    this.props.onSave();
  };

  render() {
    return (
      <Modal dimmer open className="topic-detail" size="small">
        <Modal.Header>
          <span>{this.state.id ? 'Edit assignment' : 'Insert new assignemnt'}</span>
          <Icon onClick={this.props.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>
          <Form loading={this.state.isSaving}>
            <Form.Input
              name="title"
              label='Assignment title'
              placeholder='Assignment title'
              value={this.state.title}
              onChange={this.handleInputChange}
            />
            <Form.TextArea
              rows={3}
              name="description"
              label='Assignment description'
              placeholder='Assignment description'
              value={this.state.description}
              onChange={this.handleInputChange}
            />
            {/* <Form.Group widths='equal'>
              <Form.Field>
                <LabelDetail>Assignment due date</LabelDetail>
                <DatePicker
                  selected={this.state.duedate}
                  onChange={this.handleDateChange}
                  minDate={new Date()}
                />
              </Form.Field>
            </Form.Group> */}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.onSave} disabled={!this.state.title || !this.state.description }>
            <Icon name='checkmark' /> {this.state.id ? 'Edit' : 'Save'}
          </Button>

        </Modal.Actions>
      </Modal>
    );
  }
}

export default TeacherAssignment;
