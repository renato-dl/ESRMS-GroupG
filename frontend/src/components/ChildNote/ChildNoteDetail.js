import React, { Component } from 'react';
// import './NoteDetail.scss';
import {Button, Modal, Form, Dropdown, Icon,LabelDetail} from 'semantic-ui-react';
import Select from 'react-select'
import NumericInput from 'react-numeric-input';
import { api } from '../../services/api';

import * as toastr from 'toastr';

import moment from 'moment';
import DatePicker , { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
registerLocale("en", en);

export class ChildNoteDetail extends Component {
  state = {
    classId: null,
    noteId:null,
    Title:'',
    Description: '',
    studentId:'',
    studentName:'',
    date: new Date(),
    options:[]
  };

  async componentDidMount() {
    if(this.props.note){
    this.setState({
      noteId: this.props.note.ID,
      studentId: this.props.note.StudentId,
      studentName:this.props.note.FirstName+' '+this.props.note.LastName,
      Title: this.props.note.Title,
      Date: moment(this.props.note.Date).format('LL')
    })
    const request={
        noteId:this.props.note.ID
    }
    const response = await api.parent.getChildNote(request);
    if(response)
    {
        this.setState({Description:response.data.description})
    }
  }
  }


  onClose = () => {
    this.props.onClose();
  };

  render() {
    return (
      <Modal dimmer open className="note-detail" size="small">
        <Modal.Header>
        <span> Note Detail</span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>
            <h4>Teacher Name:</h4>{this.state.studentName}
            <h4>Title:</h4>{this.state.Title}
            <h4>Description:</h4>{this.state.Description}
            <h4>Date:</h4>{this.state.Date}
        </Modal.Content>
      </Modal> 
    )
  }
}

export default ChildNoteDetail
