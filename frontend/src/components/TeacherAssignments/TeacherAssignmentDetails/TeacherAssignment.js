import React, { Component } from 'react';
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'
import "react-datepicker/dist/react-datepicker.css";
import "./TeacherAssignmentDetails.scss";
import {api} from '../../../services/api';
import * as toastr from 'toastr';
import moment from 'moment';
import DatePicker , { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
import {FilePreview} from '../../FilePreview/FilePreview.js';
import {FileUpload} from '../../FileUpload/FileUpload';
import mime from 'mime';

registerLocale("en", en);
const MAX_ALLOWED_FILES = 10;

export class TeacherAssignment extends Component {
  state = {
    id: null,
    title: '',
    description: '',
    date: moment().add(1, 'days').toDate(),
    attachments: [],
    classId: '',
    subjectId: '',
    isSaving: false,
    files: [],
  };

  onDrop = (files) => {

    const currentFilesCount = this.state.files.length + this.state.attachments.length;
    if (files.length > MAX_ALLOWED_FILES || (currentFilesCount + files.length) > MAX_ALLOWED_FILES) {
      return toastr.error("Assignment cannot have more than 10 attachments!");
    }

    this.setState({ files: [...this.state.files, ...files] });
  }

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
        date: new Date(assignment.DueDate),
        attachments: assignment.files
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

    try {
      const formData = new FormData();
      formData.set('assignmentId', this.state.id);
      formData.set('classId', this.state.classId);
      formData.set('subjectId', this.state.subjectId);
      formData.set('title', this.state.title);
      formData.set('description', this.state.description);
      formData.set('dueDate', this.state.date.toISOString());
      
      formData.set('attachments', JSON.stringify(this.state.attachments || []));

      this.state.files.forEach((file) => {
        formData.append('files', file);
      });

      if(!this.state.id) {
        await api.teacher.addAssignment(formData);
        toastr.success(`Assignment ${this.state.id ? 'updated' : 'added'} successfully.`);
      } else {
        const reqResult = await api.teacher.updateAssignment(formData);  
        
        if (reqResult.data.success) {
          toastr.success('Assignment updated successfully.');
        } else {
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
    return day !== 0 && day !== 6;
  };

  onAttachmentRemove = (name) => {
    this.setState({ attachments: this.state.attachments.filter((a) => a.Name !== name)});
  };

  onFileRemove = (name) => {
    this.setState({ files: this.state.files.filter((a) => a.name !== name)});
  };

  render() {
    const currentFilesLength = this.state.files.length + this.state.attachments.length;

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
                  selected={this.state.date}
                  onChange={this.handleDateChange}
                  minDate={moment().add(1, 'days').toDate()}
                  locale="en"
                  value={this.state.date}
                  filterDate={this.isWeekday}
                />
              </Form.Field>
            </Form.Group>
            <Form.Field>

            {(!!this.state.files.length || !!this.state.attachments.length) && <LabelDetail>Attachments</LabelDetail>}
            <div className="files">
              {this.state.files.map((file) => (
                <FilePreview 
                  type={mime.getExtension(file.type)} 
                  name={file.name} 
                  onRemove={this.onFileRemove}
                />
              ))}
              {this.state.attachments.map((file) => (
                <FilePreview 
                  type={mime.getExtension(file.Type)} 
                  name={file.Name} 
                  onRemove={this.onAttachmentRemove}
                />
              ))}
            </div>
            
            {currentFilesLength < MAX_ALLOWED_FILES && <FileUpload onDrop={this.onDrop} />}

            </Form.Field>
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
