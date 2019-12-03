import React, { Component } from 'react'

import { api } from '../../services/api';

import {Table, Icon, Container, Label} from 'semantic-ui-react';
import moment from 'moment';

import { NoData } from '../NoData/NoData';
import InternalAccountDetails from './InternalAccountDetails/InternalAccountDetails';
import InternalAccountDelete from './InternalAccountDetails/InternalAccountDelete';



export class InternalAccounts extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          authUsers: [],
          isInternalAccountDetailsOpen: false,
          deleteUserOpen: false, 
          selectedUser: null
        }
    }

    fetchUsers =  async () => {
        //const {params} = this.props.match;
        const response = await api.sysadmin.getAddUsers();
        if (response) {
            console.log(response);
          this.setState({ authUsers: response.data });
        }
    };

    async componentDidMount() {
      await this.fetchUsers();
    }
    
    addUser = () => {
        this.setState({isInternalAccountDetailsOpen: true});
    };

    onInternalAccountDetailsClose = () => {
        this.setState({isInternalAccountDetailsOpen: false});
    };

    // async deleteUser (user) {
    //     const response=await api.sysadmin.deleteUser(user)
    //     if (response) {
    //      this.fetchUsers();
    //     } 
       
    // };

    // open modal for deleting grade
    deleteUser= (user) =>{
      this.setState({deleteUserOpen: true, selectedUser: user});
    }
    onDeleteUserClose = () =>{
      this.setState({deleteUserOpen: false, selectedUser: null});
    }

    render() {
        if(this.state.authUsers.length){
        return (
          <Container className="contentContainer">
            <h3 className="contentHeader">
              <Icon name='braille'/>
              Internal Accounts Configuration
            </h3>
    
            <button className="ui vk button" onClick={this.addUser}>
              <i className="user plus icon"></i>
               Add User
            </button>
    
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textAlign="left">#</Table.HeaderCell>
                        <Table.HeaderCell textAlign="left">NAME</Table.HeaderCell>
                        <Table.HeaderCell textAlign="left">SURMANE</Table.HeaderCell>
                        <Table.HeaderCell textAlign="left">SSN</Table.HeaderCell>
                        <Table.HeaderCell textAlign="left">EMAIL</Table.HeaderCell>
                        <Table.HeaderCell textAlign="left">ACCOUNT TYPE</Table.HeaderCell>
                        <Table.HeaderCell textAlign="left">AUTH DATE</Table.HeaderCell>
                        <Table.HeaderCell textAlign="left">Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {this.state.authUsers.map((user, index) =>
                    <Table.Row key={index}>
                    <Table.Cell textAlign="left" width={1}>{ index + 1 }</Table.Cell>
                    <Table.Cell textAlign="left">{ user.FirstName }</Table.Cell>
                    <Table.Cell textAlign="left">{ user.LastName }</Table.Cell>
                    <Table.Cell textAlign="left">{ user.SSN }</Table.Cell>
    
                    <Table.Cell textAlign="left">{ user.eMail }</Table.Cell>
                    
                <Table.Cell textAlign="left">
                  { user.IsTeacher ? <Label as='a' horizontal color="teal">Teacher</Label> : ""}
                  { user.IsAdminOfficer ? <Label as='a' horizontal color="orange">Secretary Officer</Label> : ""} 
                  { user.IsPrincipal ? <Label as='a' horizontal color="red">Principal</Label> : ""}  
                </Table.Cell>

                    <Table.Cell textAlign="left" width={2}>{ moment(user.CreatedOn).format('LL') }</Table.Cell>
                    
                    <Table.Cell textAlign="left" className="edit-cell" width={1}>
                    <Icon name="delete" onClick={()=>this.deleteUser(user)}/> Delete
                  </Table.Cell>
    
                    </Table.Row>
                )}
                </Table.Body>
            </Table>
    
            {this.state.isInternalAccountDetailsOpen &&
               <InternalAccountDetails
                onClose={this.onInternalAccountDetailsClose}
                onSave={() => {
                  this.fetchUsers();
                  this.onInternalAccountDetailsClose();
                    }}
                />
            }
            {this.state.deleteUserOpen &&
            <InternalAccountDelete
              user={this.state.selectedUser}
              onClose={this.onDeleteUserClose}
              onSave={() =>{
                this.fetchUsers();
                this.onDeleteUserClose();
              }}
            />
            }
          </Container>
        );
      }
      return(
        <Container className="contentContainer">
          <h3 className="contentHeader">
              <Icon name='braille'/>
              Internal Accounts Configuration
            </h3>
    
            <button className="ui vk button" >
              <i className="user plus icon"></i>
               Add User
            </button>
          <NoData/>
          {this.state.isInternalAccountDetailsOpen &&
            <InternalAccountDetails
                onClose={this.onInternalAccountDetailsClose}
                onSave={() => {
                  this.fetchUsers();
                  this.onInternalAccountDetailsClose();
                }}
              /> 
          }
        </Container>
      );
      }
}

export default InternalAccounts
