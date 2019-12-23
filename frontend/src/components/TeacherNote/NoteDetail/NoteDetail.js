import React, { Component } from 'react';
import './NoteDetail.scss';
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react';
import Select from 'react-select'
import NumericInput from 'react-numeric-input';
import "react-datepicker/dist/react-datepicker.css";
import { api } from '../../../services/api';

import * as toastr from 'toastr';

import moment from 'moment';
import DatePicker , { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
registerLocale("en", en);

export class NoteDetail extends Component {
  state = {
    classId: null,
    noteId:null,
    Title:'',
    Description: '',
    date: new Date(),
    studentList: [],
    options:[],
    isSaving: false 
  };

  async componentDidMount() {
    const classID = this.props.classId;

    this.setState({
      classId: classID
    });
    

    try {
      const classRequest = { classId: this.props.classId };
      const allStudents = await api.teacher.getStudentsByClass(classRequest);
      if(allStudents){
        this.setState({
          studentList: allStudents.data
        });  
        this.state.studentList.map(student=>{
            var value_str = student.ID;
            var studentName_str = student.FirstName+' '+student.LastName;
            var push_item= {value:value_str,label:studentName_str}
            this.state.options.push(push_item)
        }) 
      } 
    }
    catch(e){
      this.setState({students: []});
    } 
  }

  handleInputChange = (e, { name, value }) => {  
    this.setState({[name]: value});
  };
  
  handleTypeChange = (e) => {  
    this.setState({type: e.target.textContent});
  };

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }
    this.setState({ isSaving: true });

    const allMarks = this.state.studentMarks;

    let gradeRequests = [];

    this.setState({isSaving: false});
    this.props.onSave();
  }

  onClose = () => {
    if (this.state.isSaving) {
      return;
    }
    this.setState({students: []});
    this.props.onClose();
  };

  render() {
    return (
      <Modal dimmer open className="note-detail" size="small">
        <Modal.Header>
        <span> {this.state.noteId ? 'Edit note' : 'Insert a note'}</span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>
        <Form loading={this.state.isSaving}>
            <p>StudentName</p>
             <Select
            options={this.state.options}
            defaultValue={'default'}
            onInputChange={this.handleInputChange}/>
            <Form.Input
              name="Title"
              label='Title'
              placeholder='Note title'
              value={this.state.Title}
              onChange={this.handleInputChange}
            />
            <Form.TextArea
              rows={3}
              name="Description"
              label='Description'
              placeholder='Note description'
              value={this.state.Description}
              onChange={this.handleInputChange}
            />
        </Form>
        </Modal.Content>
        <Modal.Actions>
        <Button  positive onClick={this.onSave}>
            <Icon name='checkmark' /> Save Note
          </Button>
        </Modal.Actions>
      </Modal> 
    )
  }
}

export default NoteDetail
