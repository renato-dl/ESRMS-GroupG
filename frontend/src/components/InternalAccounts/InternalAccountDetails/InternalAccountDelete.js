import React, { Component } from 'react'
import {Button, Modal, Header, Icon} from 'semantic-ui-react'
import "./InternalAccountDetails.scss";
import {api} from '../../../services/api';
import { withRouter } from "react-router";
import validator from 'validator';
import {SSNRegexp} from '../../../utils';
import * as toastr from 'toastr';

export class InternalAccountDelete extends Component {
  state = {
    userId: null,
    name: null,
    surname: null,
    email: null,
    isSaving: false
  };

  componentDidMount() {
    const accountUser = this.props.user;

    if (accountUser) {
      this.setState({
        userId: accountUser.ID,
        name: accountUser.FirstName,
        surname: accountUser.LastName,
        email: accountUser.eMail
      });
    }
  };

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const request = {
        ID: this.state.userId
      }

      const response=await api.sysadmin.deleteUser(request)
      if (response) {
        this.fetchUsers();
      } 
      toastr.success(`Account user deleted successfully.`);           
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
      <Modal dimmer open className="account-detail" size="small">
        <Header icon='archive' content='Delete user account' onClick={this.onClose}/>
        <Modal.Content>
        <p>
            Are you sure you want to delete this user account?
        </p>
        <p>Full name: {this.state.name} {this.state.surname}</p>
        <p>Email: {this.state.email}</p>
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

export default InternalAccountDelete