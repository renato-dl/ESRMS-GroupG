import React, { Component } from 'react';
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'
import "react-datepicker/dist/react-datepicker.css";
import "./TeacherAssignmentDetails.scss";
import {api} from '../../../services/api';
import * as toastr from 'toastr';
import moment from 'moment';
import DatePicker , { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
import Dropzone from 'react-dropzone';
import mime from 'mime';
import {FilePreview} from '../../FilePreview/FilePreview.js';

registerLocale("en", en);

export class TeacherAssignment extends Component {
  state = {
    id: null,
    title: '',
    description: '',
    date: moment().add(1, 'days').toDate(),
    attachment: null,
    classId: '',
    subjectId: '',
    isSaving: false,
    file: null
  };

  onDrop = (files) => {
    this.setState({ file: files[0] });
  }

  onDropRejected = (files) => {
    toastr.error(files[0].name + ' is not valid. Please upload a [.doc, .docx, .pdf] file under 5MB.');
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
        attachment: assignment.AttachmentFile
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
      
      if (this.state.attachment) {
        formData.set('attachmentFile', this.state.attachment);
      }

      formData.set('file', this.state.file);

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
    return day !== 0;
  };

  onFileRemove = () => {
    this.setState({ file: null, attachment: null });
  }

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
            {!this.state.file && !this.state.attachment &&
              <Dropzone
                accept={[mime.getType('doc'), mime.getType('docx'), mime.getType('pdf')]} 
                onDrop={this.onDrop}
                onDropRejected={this.onDropRejected}
                maxSize={5 * 1024 * 1024}
                multiple={false}
              >
                {({getRootProps, getInputProps, isDragAccept, isDragActive, isDragReject}) => {
                  const classNames = ['dropzone'];
                  if (isDragAccept) {
                    classNames.push('accept');
                  } else if (isDragReject) {
                    classNames.push('reject');
                  } else if (isDragActive) {
                    classNames.push('active')
                  }

                  return (
                    <section className="container">
                      <div {...getRootProps({className: classNames.join(' ')})}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop a file here, or click to select</p>
                      </div>
                    </section>
                  );
                }}
            </Dropzone>
            }
            {(this.state.file || this.state.attachment) &&
              <FilePreview 
                type={
                  this.state.file ? mime.getExtension(this.state.file.type) : this.state.attachment.split('.').pop()
                } 
                name={
                  this.state.file ? this.state.file.name : this.state.attachment
                } 
                onRemove={this.onFileRemove}
              />
            }
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
