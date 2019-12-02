import React from 'react'
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'
import "react-datepicker/dist/react-datepicker.css";
import {api} from '../../../../../services/api';
import { withRouter } from "react-router";
import * as toastr from 'toastr';

export class ParentDetails extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
    ID:null,
    FirstName: null,
    LastName:null,
    eMail:null,
    isSaving: false
  }};


  componentDidMount() {
    console.log(this.props)
    if (this.props) {
      this.setState({
        ID:this.props.parentInfo.ID,
        FirstName: this.props.parentInfo.FirstName,
        LastName: this.props.parentInfo.LastName,
        eMail: this.props.parentInfo.eMail
      });
    }
  };

  handleInputChange = (e, { name, value }) => {
    this.setState({[name]: value});
  };

  onSave = async () => {
    console.log(this.props)
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const parentData = {
        Id: this.props.parentInfo.ID,
        FirstName: this.state.FirstName,
        LastName: this.state.LastName,
        SSN:this.props.parentInfo.SSN,
        Email:this.state.eMail
      };
        const reqResult = await api.admin.updateParent(
            parentData
        );  
        console.log(reqResult)
        if(reqResult.data.success){
          toastr.success('Parent updated successfully.');
        }
        else{
          toastr.error(reqResult.data.Message);
        }
      }      
     catch (e) {
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
      <Modal dimmer open className="parent-detail" size="small">
        <Modal.Header>
          <span> 'Edit Parent' </span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>
          <Form loading={this.state.isSaving}>
            <Form.Input
              name="FirstName"
              label='Parent FirstName'
              placeholder='Parent FirstName'
              value={this.state.FirstName}
              onChange={this.handleInputChange}
            />
            <Form.Input
              name="LastName"
              label='Parent LastName'
              placeholder='Parent LastName'
              value={this.state.LastName}
              onChange={this.handleInputChange}
            />
            <Form.Input
              name="eMail"
              label='Parent eMail'
              placeholder='Parent eMail'
              value={this.state.eMail}
              onChange={this.handleInputChange}
            />
            <Form.Group widths='equal'>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.onSave} disabled={!this.state.FirstName || !this.state.LastName || !this.state.eMail}>
            <Icon name='checkparent' /> Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(ParentDetails);
