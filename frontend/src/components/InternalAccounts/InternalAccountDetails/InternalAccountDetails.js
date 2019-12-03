import React from 'react'

import PropTypes from 'prop-types';
import './InternalAccountDetails.scss';

import {Button, Modal, Form, Icon, Label, Checkbox, Segment} from 'semantic-ui-react'
import "./InternalAccountDetails.scss";
import {api} from '../../../services/api';
import { withRouter } from "react-router";
import validator from 'validator';
import {SSNRegexp} from '../../../utils';
import * as toastr from 'toastr';
 

class InternalAccountDetails extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
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
}

  handleCheckboxClick = (e, {name, checked}) => {
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
    console.log(hasErrors, errors);
    if (hasErrors) {
      this.setState({errors});
      return;
    }

    this.setState({isSaving: true});
    try {
      const userData = {
        SSN:this.state.ssn,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        eMail: this.state.email,
        isTeacher: this.state.IsTeacher,
        isAdminOfficer: this.state.IsAdminOfficer,
        isPrincipal: this.state.IsPrincipal,

      };

      console.log(userData);

      await api.sysadmin.createUser(userData);

      toastr.success(`User created successfully.`);
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
    errors['ssn'] = !SSNRegexp.test(this.state.ssn);

    const hasErrors = !!Object.keys(errors).filter((e) => errors[e]).length;
    return [hasErrors, errors];
  };

  handleChangeChk(e){
    console.log(e);

  }

  toggleChangeAdmin = () => {
    this.setState({
      IsAdminOfficer: (!this.state.IsAdminOfficer ? 1 : 0 )
    });
    if (this.state.IsTeacher == 1) this.setState({IsTeacher:0})
    if (this.state.IsPrincipal == 1) this.setState({IsPrincipal:0})
  }
  
  toggleChangePrincipal = () => {
    this.setState({
      IsPrincipal: (!this.state.IsPrincipal ? 1 : 0)
    });
    if (this.state.IsAdminOfficer == 1) this.setState({IsAdminOfficer:0})
  }
  
  toggleChangeTeacher = () => {
    this.setState({
      IsTeacher: (!this.state.IsTeacher ? 1 : 0)
    });
    if (this.state.IsAdminOfficer == 1) this.setState({IsAdminOfficer:0})
  }

  render(){
    return(
      <Modal dimmer open className="topic-detail" size="small">
        <Modal.Header>
          <span>Add New User</span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>




          

          <Form loading={this.state.isSaving} className="account-detail">


            {/* </Form.Group> */}
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
                defaultChecked={this.state.IsPrincipal}
                onClick={this.handleCheckboxClick}
              />
            </Segment>
            <Segment compact className="custom" color="teal">
              <Checkbox label={<label>Teacher</label>} 
                id="IsTeacher"
                name="IsTeacher"
                defaultChecked={this.state.IsTeacher}
                onClick={this.handleCheckboxClick}
              />
            </Segment>
            <Segment compact className="custom" color="orange">
              <Checkbox label={<label>Secretary Officer</label>} 
                id="IsAdminOfficer"
                name="IsAdminOfficer"
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
