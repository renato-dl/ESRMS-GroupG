import React from 'react'
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'

//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

import "./ConfigParentDetails.scss";
import {api} from '../../../services/api';
import { withRouter } from "react-router";

class ConfigParentDetails extends React.Component {
    state = {
        firstName:'',
        lastName:'',
        ssn:'',
        email:'',
        password:'',
        confirmPass:'',
        isSaving: false
    };

    handleInputChange = (e, { name, value }) => {
        this.setState({[name]: value});
      };


    onSave = async () => {
        if (this.state.isSaving) {
            return;
        }

        this.setState({isSaving: true});
        const {params} = this.props.match;
        try {
            const parentData = {
                SSN:this.state.ssn,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                eMail: this.state.email,
                password: this.state.password
            };

            console.log(parentData);
            
            await api.admin.saveNewParent(
                params.adminId,
                parentData
            ); 
        } catch (e) {
            console.log(e);
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

    render(){
        return(


            <Modal dimmer="blurring" open className="topic-detail" size="small">
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
              name='ssn'
              label='SSN'
              placeholder='SSN'
              value={this.state.ssn}
              onChange={this.handleInputChange}
            />

            <Form.Input 
                fluid icon='user' 
                iconPosition='left'
                
                name="email"
                label='E-mail'
                placeholder='E-mail'
                type='email' 
                placeholder='E-mail address' 
                value={this.state.email}
                onChange={this.handleInputChange}
            />
            <Form.Group widths='equal'>
                <Form.Input                
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