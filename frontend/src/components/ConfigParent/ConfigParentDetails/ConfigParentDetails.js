import React from 'react'
import {Button, Modal, Form, Icon} from 'semantic-ui-react'
import "./ConfigParentDetails.scss";
import {api} from '../../../services/api';
import { withRouter } from "react-router";
import validator from 'validator';
import {SSNRegexp} from '../../../utils';
import * as toastr from 'toastr';

class ConfigParentDetails extends React.Component {
  state = {
    firstName:'',
    lastName:'',
    ssn:'',
    email:'',
    isSaving: false,
    errors: {}
  };

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
      const parentData = {
        SSN:this.state.ssn,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        eMail: this.state.email
      };

      console.log(parentData);

      await api.admin.saveNewParent(
        // params.adminID,
        '205db8275d3c06e6ce3fe7a47b30e0fe',
        parentData
      );

      toastr.success(`Parent create successfully.`);
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

  render(){
    return(
      <Modal dimmer open className="topic-detail" size="small">
        <Modal.Header>
          <span>Add a parent</span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>

          <Form loading={this.state.isSaving}>
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

export default withRouter(ConfigParentDetails);
