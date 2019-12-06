import React from 'react'
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {api} from '../../../../../services/api';
import { withRouter } from "react-router";
import * as toastr from 'toastr';
import { SSNRegexp } from '../../../../../utils';

export class StudentDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ID:null,
      FirstName: null,
      LastName:null,
      Gender:null,
      BirthDate: new Date(),
      SSN:null,
      Parent1Id:null,
      Parent2Id:null,
      isSaving: false,
      errors: {}
    }
  };


  componentDidMount() { 
    const {studentInfo} = this.props;

    if (studentInfo) {
      this.setState({
        ID:studentInfo.ID,
        FirstName: studentInfo.FirstName,
        LastName: studentInfo.LastName,
        Gender: studentInfo.Gender,
        SSN:studentInfo.SSN,
        BirthDate: new Date(studentInfo.BirthDate),
        Parent1Id:this.props.parentInfo.ID
      });

      if(this.props.parentInfo2) {
        this.setState({Parent2Id:this.props.parentInfo2.ID})
      }
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

    const hasErrors = this.validateFields();
    if (hasErrors) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const studentData = {
        Id: this.props.studentInfo.ID,
        FirstName: this.state.FirstName,
        LastName: this.state.LastName,
        SSN:this.state.SSN,
        Gender: this.state.Gender,
        BirthDate: this.state.BirthDate.toUTCString(),
        Parent1Id:this.state.Parent1Id,
        Parent2Id:this.state.Parent2Id
      };
        const reqResult = await api.admin.updateStudent(studentData);

        if (reqResult.data.success) {
          toastr.success('Student updated successfully.');
        } else {
          toastr.error(reqResult.data.Message);
        }
    } catch (e) {
      this.setState({isSaving: false});
      return toastr.error(e);
    }

    this.setState({isSaving: false});
    this.props.onSave();
  };

  validateFields = () => {
    const errors = {...this.state.errors};

    errors['FirstName'] = !this.state.FirstName;
    errors['LastName'] = !this.state.LastName;
    errors['SSN'] = !SSNRegexp.test(this.state.SSN);

    this.setState({errors});
    return !!Object.keys(errors).filter((e) => errors[e]).length;
  }; 

  onClose = () => {
    if (this.state.isSaving) {
      return;
    }

    this.props.onClose();
  };

  render() {
    return (
      <Modal dimmer open className="topic-detail" size="small">
        <Modal.Header>
          <span>
            <Icon name="edit"/>Edit Student:&nbsp;&nbsp; 
            <span style={{textTransform: 'capitalize'}}> 
              {this.state.FirstName} {this.state.LastName}
            </span> 
          </span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>
          <Form loading={this.state.isSaving}>
            <Form.Input
              error={this.state.errors['FirstName']}
              name="FirstName"
              label='Student FirstName'
              placeholder='Student FirstName'
              value={this.state.FirstName}
              onChange={this.handleInputChange}
            />
            <Form.Input
              error={this.state.errors['LastName']}
              name="LastName"
              label='Student LastName'
              placeholder='Student LastName'
              value={this.state.LastName}
              onChange={this.handleInputChange}
            />
            <Form.Group widths='equal'>
              <Form.Select
                error={this.state.errors['Gender']}
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
              <Form.Input
                error={this.state.errors['SSN']}
                name="SSN"
                label='SSN'
                placeholder='SSN'
                value={this.state.SSN}
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.onSave} disabled={!this.state.FirstName || !this.state.LastName || !this.state.BirthDate||!this.state.Parent1Id}>
            <Icon name='checkmark' /> Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(StudentDetails);
