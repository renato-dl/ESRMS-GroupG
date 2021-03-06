import React, { Component } from 'react';
import './NoteDetail.scss';
import {Button, Modal, Form, Icon} from 'semantic-ui-react';
import Select from 'react-select'
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
    Date:new Date(),
    Description: '',
    studentId:'',
    studentName:'',
    studentList: [],
    isSeen:false,
    options:[],
    isSaving: false 
  };

  async componentDidMount() {
    if(this.props.note){
    this.setState({
      noteId: this.props.note.ID,
      studentId: this.props.note.StudentId,
      studentName:this.props.note.FirstName+' '+this.props.note.LastName,
      Title: this.props.note.Title,
      Description: this.props.note.Description,
      Date:this.props.note.Date
    })
  }

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


  handleSelectChange=(event)=>{
    console.log(event)
    this.setState({studentId:event.value});
    this.setState({studentName:event.label})
  }

  onDateChange = (date) => {
    this.setState({ Date: date });
  }


  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const noteData = {
        title: this.state.Title,
        description: this.state.Description,
        studentId:this.state.studentId,
        noteId: this.state.noteId,
        isSeen:false,
        date: this.state.Date
      };

      if(!this.state.noteId) {
        const reqResult=await api.teacher.saveNote(noteData);
        if (reqResult.data.success) {
          toastr.success('Note added successfully.');
        } 
        else {
          toastr.error(reqResult.data.Message);
          this.setState({isSaving: false});
          return;
        }
      }
      else {
        const reqResult = await api.teacher.updateNote(noteData);  
        if (reqResult.data.success) {
          toastr.success('Note updated successfully.');
        } else {
          toastr.error(reqResult.data.Message);
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
  }

  onClose = () => {
    if (this.state.isSaving) {
      return;
    }
    this.setState({students: []});
    this.props.onClose();
  };

  isWeekday = date => {
    const day = moment(date).day();
    return day !== 0 && day !== 6 ;
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
            <h5>Student Name</h5>
            {!this.state.noteId?(
            <Select
            name='studentId'
            fluid
            defaultValue={{value:this.state.studentId,label:this.state.studentName}}
            onChange={this.handleSelectChange}
            value={{value:this.state.studentId,label:this.state.studentName}}
            options={this.state.options}/>
            ):(
              <p>{this.state.studentName}</p>
            )
            }
            <p></p>
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
            <h5>Date</h5>
            <DatePicker 
              placeholderText="Date" 
              name="Date" 
              maxDate={new Date()} 
              selected={this.state.Date ? new Date(this.state.Date) : new Date()} 
              onChange={this.onDateChange}
              locale="en" 
              filterDate = {this.isWeekday} 
              disabled={this.state.noteId}
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
