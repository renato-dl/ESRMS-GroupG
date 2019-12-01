import React from 'react'
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {api} from '../../../../../services/api';
import { withRouter } from "react-router";
import * as toastr from 'toastr';

export class StudentDetails extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
    FirstName: null,
    LastName:null,
    Gender:null,
    BirthDate: new Date(),
    isSaving: false
  }};


  componentDidMount() {
    const {studentInfo} = this.props;

    if (studentInfo) {
      this.setState({
        FirstName: studentInfo.FirstName,
        LastName: studentInfo.LastName,
        Gender: studentInfo.Gender,
        BirthDate: new Date(studentInfo.BirthDate)
      });
    }
  };

  handleInputChange = (e, { name, value }) => {
    this.setState({[name]: value});
  };

  handleDateChange = (date) => {
    this.setState({BirthDate:date});
  };

  onSave = async () => {
    console.log(this.props)
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const studentData = {
        Id: this.props.studentInfo.ID,
        FirstName: this.state.FirstName,
        LastName: this.state.LastName,
        SSN:this.props.studentInfo.SSN,
        Gender: this.state.Gender,
        BirthDate: this.state.BirthDate.toUTCString(),
        Parent1Id:'9e412480-4287-4b62-a1ba-a8dcb03cdd41'
      };


      if(!this.state.studentID){
        await api.admin.saveStudent(
            studentData
        );
        toastr.success(`Student ${this.props.studentInfo.ID } updated successfully.`);
      }
      else{
        const reqResult = await api.admin.updateStudent(
            studentData
        );  
        if(reqResult.data.Success){
          toastr.success('Student updated successfully.');
        }
        else{
          toastr.error(reqResult.data.Message);
        }
      }      
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
      <Modal dimmer open className="student-detail" size="small">
        <Modal.Header>
          <span> 'Edit student' </span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>
          <Form loading={this.state.isSaving}>
            <Form.Input
              name="FirstName"
              label='Student FirstName'
              placeholder='Student FirstName'
              value={this.state.FirstName}
              onChange={this.handleInputChange}
            />
            <Form.Input
              name="LastName"
              label='Student LastName'
              placeholder='Student LastName'
              value={this.state.LastName}
              onChange={this.handleInputChange}
            />
            <Form.Group widths='equal'>
              <Form.Select
                name="Gender"
                label="Gender"
                options={[
                  { key: '1', text: 'M', value: 'M' },
                  { key: '2', text: 'F', value: 'F' },
                ]}
                placeholder="Gender"
                value={this.state.Gender}
                onChange={this.handleInputChange}
              />
              <Form.Field>
                <LabelDetail>BirthDate</LabelDetail>
                <DatePicker
                  selected={this.state.BirthDate}
                  onChange={this.handleDateChange}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.onSave} disabled={!this.state.FirstName || !this.state.LastName || !this.state.BirthDate}>
            <Icon name='checkstudent' />Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(StudentDetails);
