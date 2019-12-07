import React, { Component } from 'react';
import './GradeDetail.scss';
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react';
import NumericInput from 'react-numeric-input';
import moment from 'moment';
import * as toastr from 'toastr';
import {api} from '../../../services/api';

export class GradeUpdate extends Component {
  state = {
    gradeId: null,
    name: null,
    surname: null,
    value: 2,
    date: null,
    studentId: null,
    class: '',
    subject: '',
    isSaving: false,
    updated: false
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
          value: dgrade.Grade.toString(),
          type: dgrade.Type,
          date: new Date(dgrade.GradeDate),
          studentId: dgrade.StudentId
        });
      }
      catch(e){

      }
    }
  };

  handleTypeChange = (e) => {  
    this.setState({type: e.target.textContent});
  };

  changeValue = (mark) => {
    this.setState({ value: mark, updated: true });
  }

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const gradeUpdated = {
        classId: this.state.class,
        subjectId: this.state.subject,
        studentId: this.state.studentId,
        ID: this.state.gradeId,
        grade: this.state.value,
        type: this.state.type
      };

      await api.teacher.updateMark(gradeUpdated);
      toastr.success(`Grade updated successfully.`);           
    } catch (e) {
      this.setState({isSaving: false});
      return toastr.error(e);
    }

    this.setState({isSaving: false, updated: false});
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
      <Modal.Header>
        Update grade
        <Icon onClick={this.onClose} className="close-icn" name="close" />
      </Modal.Header>
      <Modal.Content>
        <Form loading={this.state.isSaving}>
          <Form.Group widths='equal'>
          <Form.Select
              name="Type"
              label="Type"
              options={[
                { key: '1', text: 'Written', value: 'Written' },
                { key: '2', text: 'Oral', value: 'Oral' }
              ]}
              placeholder="Type"
              value={this.state.type}
              onChange={this.handleTypeChange}
            />
            <Form.Field>
              <LabelDetail>Grade date</LabelDetail>  
              <Form.Input fluid placeholder={ moment(this.state.date).format('LL')} readOnly />           
            </Form.Field>              
          </Form.Group>
              <Form.Field className="student-grade">
                <label>{ this.state.name } { this.state.surname }</label>
                <NumericInput 
                  className="numberInput" 
                  valueType="decimal" 
                  min={0} 
                  max={10} 
                  step={0.25}
                  value={this.state.value}
                  onChange={(e) => {this.changeValue(e)} }
                />                   
              </Form.Field>           
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button  positive onClick={this.onSave} disabled={this.updated || (this.state.value === null || (parseFloat(this.state.value) < 0.00))}>
          <Icon name='checkmark' /> Update Grade
        </Button>

      </Modal.Actions>
    </Modal> 
    )
  }
}

export default GradeUpdate
