import React from 'react'
import {Button, Modal, Form, Icon} from 'semantic-ui-react'
import "./ConfigParentDetails.scss";
import {api} from '../../../services/api';
import { withRouter } from "react-router";
import validator from 'validator';
import passwordValidator from 'password-validator';
import {SSNRegexp} from '../../../utils';
import * as toastr from 'toastr';

class ConfigParentDetails extends React.Component {
  state = {
    firstName:'',
    lastName:'',
    ssn:'',
    email:'',
    password:'',
    confirmPass:'',
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
        eMail: this.state.email,
        password: this.state.password,
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

    const passwordSchema = new passwordValidator();
    passwordSchema
      .is().min(8)
      .is().max(100)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().not().spaces();


    errors['password'] = !passwordSchema.validate(this.state.password);
    errors['confirmPass'] = !passwordSchema.validate(this.state.confirmPass) || this.state.password !== this.state.confirmPass;

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
              icon='user'
              iconPosition='left'
              name="email"
              label='E-mail'
              type='email'
              placeholder='E-mail address'
              value={this.state.email}
              onChange={this.handleInputChange}
            />
            <Form.Group widths='equal'>
              <Form.Input
                error={this.state.errors['password']}
                fluid
                icon='lock'
                iconPosition='left'
                name="password"
                label='Password'
                placeholder='Password'
                type='password'
                value={this.state.password}
                onChange={this.handleInputChange}
              />
              <Form.Input
                error={this.state.errors['confirmPass']}
                fluid
                icon='lock'
                iconPosition='left'
                name="confirmPass"
                label='Confirm Password'
                placeholder='Confirm Password'
                type='password'
                value={this.state.confirmPass}
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Field className="error">
              {this.state.errors['password'] && (
                <div className="error">
                  *Password must be at least 8 characters and contain at leas an uppercase/lowercase letter and a digit.
                </div>
              )}
              {this.state.errors['confirmPass'] && (
                <div className="error">*Passwords do not match</div>
              )}
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.onSave} disabled={!this.state.firstName || !this.state.lastName || !this.state.ssn || !this.state.email || !this.state.password || !this.state.confirmPass}>
            <Icon name='checkmark' /> Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default withRouter(ConfigParentDetails);
