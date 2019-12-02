import React, { Component } from 'react';
import './GradeDetail.scss';
import {Button, Modal, Header, Icon} from 'semantic-ui-react';
import moment from 'moment';
import * as toastr from 'toastr';
import {api} from '../../../services/api';

export class GradeDelete extends Component {
  state = {
    gradeId: null,
    name: null,
    surname: null,
    value: null,
    date: null,
    studentId: null,
    class: '',
    subject: '',
    isSaving: false
  };

  componentDidMount() {
    const dgrade = this.props.grade;
    const classId = this.props.classId;
    const subjectId =this.props.subjectId;

    this.setState({
      class: classId,
      subject: subjectId,
    });

    if (dgrade) {
      try{
        this.setState({
          gradeId: dgrade.ID,
          name: dgrade.FirstName,
          surname: dgrade.LastName,
          value: dgrade.Grade,
          type: dgrade.Type,
          date: dgrade.GradeDate,
          studentId: dgrade.StudentId
        });
      }
      catch(e){

      }
    }
  };

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const request = {
        ID: this.state.gradeId
      }

      await api.teacher.deleteMark(request);
      toastr.success(`Grade deleted successfully.`);           
    } catch (e) {
      this.setState({isSaving: false});
      return toastr.error(e);
    }

    this.setState({isSaving: false});
    this.props.onSave();
  };

  onClose = () => {
    if (this.state.isSaving) {
      return;
    }

    this.props.onClose();
  };

  render() {
    return (
      <Modal dimmer open className="grade-detail" size="small">
        <Header icon='archive' content='Delete Grade' onClick={this.onClose}/>
        <Modal.Content>
        <p>
            Are you sure you want to delete this mark?
        </p>
        <p>Student: {this.state.name} {this.state.surname}</p>
        <p>{this.state.type} {this.state.value}</p>
        <p>Date: { moment(this.state.date).format('LL')}</p>
        </Modal.Content>
        <Modal.Actions>
        <Button basic color='red' onClick={this.onClose}>
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

export default GradeDelete