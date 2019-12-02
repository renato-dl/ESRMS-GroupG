import React, { Component } from 'react';
import './GradeDetail.scss';
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import NumberInput from 'semantic-ui-react-numberinput';
import "react-datepicker/dist/react-datepicker.css";
import { api } from '../../../services/api';
import * as toastr from 'toastr';

export class GradeDetail extends Component {
  state = {
    classId: null,
    subjectId: null,
    type: 'Written',
    description: '',
    date: new Date(),
    students: [],
    studentMarks: new Map(),
    value: 0,
    isSaving: false 
  };

  async componentDidMount() {
    const classID = this.props.classId;
    const subjectID = this.props.subjectId;

    this.setState({
      classId: classID, 
      subjectId: subjectID
    });

    try {
      const classRequest = { classId: this.props.classId };
      const allStudents = await api.teacher.getStudentsByClass(classRequest);
      const studentsMap = new Map();
      if(allStudents){
        this.setState({
          students: allStudents.data
        });
        allStudents.data.forEach(element => {
          studentsMap.set(element.ID, "0");          
        });
        this.setState({
          studentMarks: studentsMap
        });        
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

  handleDateChange = (date) => {
    this.setState({date});
  };

  changeValue = (studentId, mark) => {
    const marks = this.state.studentMarks;
    marks.set(studentId, mark);    
    this.setState({ studentMarks: marks });
  }

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }
    this.setState({isSaving: true});

    const allMarks = this.state.studentMarks;

    allMarks.forEach(async (key, value) => {
      if(key != "0"){
        try{
          let correctedDate = this.state.date;
          correctedDate = correctedDate.toUTCString();
          const request = {
            subjectId: this.state.subjectId,
            studentId: value,
            classId: this.state.classId,
            grade: key,
            gradeDate: correctedDate,
            type: this.state.type
          }
          const response = await api.teacher.addMark(request);
          if(response){
            toastr.success('Grade added successfully!');
          }
        }
        catch(e){
          this.setState({isSaving: false});
          toastr.error(e);
        }        
      }
    });
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
      <Modal dimmer open className="grade-detail" size="small">
        <Modal.Header>
          Add Grades
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
                <DatePicker
                  selected={this.state.date}
                  onChange={this.handleDateChange}
                  maxDate={new Date()}
                />              
              </Form.Field>              
            </Form.Group>
            {this.state.students.length > 0 && 
              this.state.students.map((eStudent, index) =>  
                <Form.Field key={index} inline>
                  <label>{ eStudent.FirstName } { eStudent.LastName }</label>
                  <NumberInput className="numberInput" valueType="decimal" 
                  minValue={2} maxValue={10} 
                  stepAmount={0.25} allowEmptyValue value={this.state.studentMarks.get(eStudent.ID)}
                  onChange={(e) => {this.changeValue(eStudent.ID, e)} }/>                   
                </Form.Field>                 
              )}          
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button  positive onClick={this.onSave} disabled={!this.state.date}>
            <Icon name='checkmark' /> Save Grades
          </Button>

        </Modal.Actions>
      </Modal> 
    )
  }
}

export default GradeDetail
