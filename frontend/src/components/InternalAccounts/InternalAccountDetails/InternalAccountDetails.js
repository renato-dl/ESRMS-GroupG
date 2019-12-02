import React from 'react'

import PropTypes from 'prop-types';
import './InternalAccountDetails.scss';

import {Button, Modal, Form, Icon, Label} from 'semantic-ui-react'
import "./InternalAccountDetails.scss";
import {api} from '../../../services/api';
import { withRouter } from "react-router";
import validator from 'validator';
import {SSNRegexp} from '../../../utils';
import * as toastr from 'toastr';
 

//const roleOptions=["Admin Officer","Teacher" ,"Principal"];
const checkboxes = [
  {
    name: 'IsAdminOfficer',
    key: 'IsAdminOfficer',
    label: 'Admn Officer',
  },
  {
    name: 'IsTeacher',
    key: 'IsTeacher',
    label: 'Teacher',
  },
  {
    name: 'IsPrincipal',
    key: 'IsPrincipal',
    label: 'Principal',
  }
];

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange }) => (
  <input type={type} name={name} checked={checked} onChange={onChange} />
);

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

class InternalAccountDetails extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
    firstName:'',
    lastName:'',
    ssn:'',
    email:'',
    isSaving: false,
    errors: {},
    /* checkboxes: roleOptions.reduce(
      (options, option) => ({
        ...options,
        [option]: 0
      }),
      {}
    ) */
    
    checkedItems: new Map(),

  };
  this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
}

handleCheckboxChange(e) {
  const item = e.target.name;
  const isChecked = e.target.checked;
  this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
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
        eMail: this.state.email
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

  render(){
    return(
      <Modal dimmer open className="topic-detail" size="small">
        <Modal.Header>
          <span>Add New User</span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>

          <Form loading={this.state.isSaving} className="account-detail">
        
          {checkboxes.map(item => (
            <label class="container" key={item.key} > {item.label}
            <input type="checkbox" name={item.name} checked={this.state.checkedItems.get(item.name)} onChange={this.handleCheckboxChange} />
              <span class="checkmark"></span>
            </label>
          ))}

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

export default withRouter(InternalAccountDetails);
