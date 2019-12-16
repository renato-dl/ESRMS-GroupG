import React, { Component } from 'react';
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'
import "react-datepicker/dist/react-datepicker.css";
import "./TeacherAssignmentDetails.scss";
import {api} from '../../../services/api';
import * as toastr from 'toastr';
import moment from 'moment';

import DatePicker , { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
registerLocale("en", en);

export class TeacherAssignment extends Component {
  state = {
    id: null,
    title: '',
    description: '',
    duedate: moment().add(1, 'days').toDate(),
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

  handleDateChange = (duedate) => {
    this.setState({duedate: duedate});
  };

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const  assignmentData= {
        assignmentId: this.state.id,
        classId: this.state.classId,
        subjectId: this.state.subjectId,
        title: this.state.title,
        description: this.state.description,
        dueDate: this.state.duedate.toUTCString()
      };

      if(!this.state.id) {
        await api.teacher.addAssignment(assignmentData);
        toastr.success(`Assignment ${this.state.id ? 'updated' : 'added'} successfully.`);
      } 
      else {
        const reqResult = await api.teacher.updateAssignment(assignmentData);  
        
        if (reqResult.data.success) {
          toastr.success('Assignment updated successfully.');
        } 
        else {
          toastr.error(reqResult.data.message);
          this.setState({isSaving: false});
          return;
        }
      }
    } catch (e) {
      this.setState({isSaving: false});
      return toastr.error(e);
    }

    this.setState({isSaving: false});
    this.props.onSave();
  };

  isWeekday = date => {
    const day = moment(date).day();
    return day !== 0;
  };

  render() {
    return (
      <Modal dimmer open className="assignment-detail" size="small">
        <Modal.Header>
          <span>{this.state.id ? 'Edit assignment' : 'Insert new assignment'}</span>
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
            <Form.Group widths='equal'>
              <Form.Field>
                <LabelDetail>Assignment due date</LabelDetail>
                <DatePicker
                  selected={this.state.duedate}
                  onChange={this.handleDateChange}
                  minDate={moment().add(1, 'days').toDate()}
                  locale="en"
                  filterDate={this.isWeekday}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color={this.state.id ? 'yellow' : 'green'}  onClick={this.onSave} disabled={!this.state.title || !this.state.description }>
            <Icon name={this.state.id ? 'edit' : 'checkmark'}  /> {this.state.id ? 'Edit' : 'Save'}
          </Button>

        </Modal.Actions>
      </Modal>
    );
  }
}

export default TeacherAssignment;
