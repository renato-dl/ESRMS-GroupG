import React from 'react'
import './InternalAccountDetails.scss';
import {Button, Modal, Form, Icon, Checkbox, Segment} from 'semantic-ui-react'
import {api} from '../../../services/api';
import { withRouter } from "react-router";
import validator from 'validator';
import {SSNRegexp} from '../../../utils';
import * as toastr from 'toastr';
 

class InternalAccountDetails extends React.Component {
  state = {
    userID: null,
    firstName:'',
    lastName:'',
    ssn:'',
    email:'',

    IsTeacher:false,
    IsAdminOfficer:false,
    IsPrincipal:false,

    isSaving: false,
    errors: {},

  };

  componentDidMount() {
    const {user} = this.props;
    
    if (user) {
      this.setState({
        userID: user.ID,
        firstName: user.FirstName,
        lastName: user.LastName,
        ssn: user.SSN,
        email: user.eMail,
        IsTeacher: user.IsTeacher,
        IsAdminOfficer: user.IsAdminOfficer,
        IsPrincipal: user.IsPrincipal
      });
    }
  }

  handleCheckboxClick = (e, {name, checked}) => {
    if(name === 'IsAdminOfficer' && checked){
      this.setState({IsTeacher:false, IsPrincipal:false})
    }else if ((name === 'IsTeacher' || name === 'IsPrincipal') || checked){
      this.setState({IsAdminOfficer:false})
    }
    this.setState({[name]: checked});
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({[name]: value});
  };

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    const [hasErrors, errors] = this.validateFields();
    
    //console.log(hasErrors, errors);
    if (hasErrors) {
      this.setState({errors});
      return;
    }

    this.setState({isSaving: true});
    const {params} = this.props.match;
    try {
      const userData = {
        SSN:this.state.ssn.trim(),
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        eMail: this.state.email,
        isTeacher: this.state.IsTeacher,
        isAdminOfficer: this.state.IsAdminOfficer,
        isPrincipal: this.state.IsPrincipal

      };
      const userDataForEdit = {
        Id: this.state.userID,
        SSN: this.state.ssn.trim(),
        FirstName: this.state.firstName,
        LastName: this.state.lastName,
        eMail: this.state.email,
        isTeacher: this.state.IsTeacher,
        isAdminOfficer: this.state.IsAdminOfficer,
        isPrincipal: this.state.IsPrincipal

      };

      if(!this.state.userID){
        await api.sysadmin.createUser(userData);
        toastr.success(`User created successfully.`);
      }
      else{
        const reqResult = await api.sysadmin.updateUser(userDataForEdit);
        //if(reqResult.data.Success){
          toastr.success('User updated successfully.');
        /*} 
        else{
          toastr.error(reqResult.data.Message);
        }  */
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

  validateFields = () => {
    let errors = this.state.errors;

    errors['email'] = !validator.isEmail(this.state.email);
    errors['ssn'] = !SSNRegexp.test(this.state.ssn.trim());

    const hasErrors = !!Object.keys(errors).filter((e) => errors[e]).length;
    return [hasErrors, errors];
  };



  render(){
    return(
      <Modal dimmer open className="topic-detail" size="small">
        <Modal.Header>
{this.state.userID ? <span><Icon name='edit'/> Edit User Data</span> : <span><Icon name="user plus icon"/> Add New User</span>  }   
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>
          <Form loading={this.state.isSaving} className="account-detail">
            <Form.Group widths='equal'>
              <Form.Input
                name='firstName'
                label='Name'
                placeholder='Name'
                value={this.state.firstName}
                onChange={this.handleInputChange}
              />
              <Form.Input
                name='lastName'
                label='Surname'
                placeholder='Surname'
                value={this.state.lastName}
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group widths='equal'>
            <Form.Input
              error={this.state.errors['ssn']}
              name='ssn'
              label='SSN'
              placeholder='SSN'
              value={this.state.ssn}
              onChange={this.handleInputChange}
            />

            <Form.Input
              error={this.state.errors['email']}
              fluid
              icon='envelope'
              iconPosition='left'
              name="email"
              label='E-mail'
              type='email'
              placeholder='E-mail address'
              value={this.state.email}
              onChange={this.handleInputChange}
            />
            </Form.Group>
            <Segment compact className="custom" color="red">
              <Checkbox label={<label>Principal</label>} 
                id="IsPrincipal"
                name="IsPrincipal"
                checked={this.state.IsPrincipal}
                defaultChecked={this.state.IsPrincipal}
                onClick={this.handleCheckboxClick}
              />
            </Segment>
            <Segment compact className="custom" color="teal">
              <Checkbox label={<label>Teacher</label>} 
                id="IsTeacher"
                name="IsTeacher"
                checked={this.state.IsTeacher}
                defaultChecked={this.state.IsTeacher}
                onClick={this.handleCheckboxClick}
              />
            </Segment>
            <Segment compact className="custom" color="orange">
              <Checkbox label={<label>Secretary Officer</label>} 
                id="IsAdminOfficer"
                name="IsAdminOfficer"
                checked={this.state.IsAdminOfficer}
                defaultChecked={this.state.IsAdminOfficer}
                onClick={this.handleCheckboxClick}
              />
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.onSave} disabled={!this.state.firstName || !this.state.lastName || !this.state.ssn || !this.state.email}>
            <Icon name='checkmark' /> Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default withRouter(InternalAccountDetails);
