import React, { Component } from 'react'

import { api } from '../../services/api';

import {Table, Icon, Container, Label} from 'semantic-ui-react';
import moment from 'moment';

import './InternalAccountDetails/InternalAccountDetails.scss'

import { NoData } from '../NoData/NoData';
import InternalAccountDetails from './InternalAccountDetails/InternalAccountDetails';
import InternalAccountDelete from './InternalAccountDetails/InternalAccountDelete';
import { Topic } from '../Topic/Topic';



export class InternalAccounts extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          authUsers: [],
          isInternalAccountDetailsOpen: false,
          editingUser: null,
          selectedUser: null, 
          deleteUserOpen: false, 
          selectedUser: null
        }
    }

    fetchUsers =  async () => {
        //const {params} = this.props.match;
        const response = await api.sysadmin.getAddUsers();
        if (response) {
            console.log(response);
          this.setState({ authUsers: response.data, editingUser: null});
        }
    };

    async componentDidMount() {
      await this.fetchUsers();
    }
    
    addUser = () => {
        this.setState({editingUser:null, isInternalAccountDetailsOpen: true});
    };

    editUser = (user) => {
      this.setState({editingUser: user, isInternalAccountDetailsOpen: true});
    };

    onInternalAccountDetailsClose = () => {
        this.setState({isInternalAccountDetailsOpen: false});
    };

    // open modal for deleting user
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
    
            <Table celled color='teal' >
                <Table.Header>
                    <Table.Row positive>
                        <Table.HeaderCell textAlign="center">#</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">NAME</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">SURMANE</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">SSN</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">EMAIL</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">ACCOUNT TYPE</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">AUTH DATE</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center"></Table.HeaderCell>
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
                    
                <Table.Cell textAlign="left" className="rolesLables">
                  { user.IsTeacher ? <Label horizontal color="teal" className="rolesLables">Teacher</Label> : ""}
                  { user.IsAdminOfficer ? <Label horizontal color="orange" className="rolesLables">Secretary Officer</Label> : ""} 
                  { user.IsPrincipal ? <Label horizontal color="red" className="rolesLables" >Principal</Label> : ""}  
                  { user.IsSysAdmin ? <Label horizontal color="black" className="rolesLables">System Admin</Label> : ""}
                  { user.IsParent ? <Label horizontal color="blue" className="rolesLables" >Parent</Label> : ""}  
                </Table.Cell>
 
                    <Table.Cell textAlign="left" width={2}>{ moment(user.CreatedOn).format('LL') }</Table.Cell>
                    
                    <Table.Cell textAlign="center" className="edit-cell" width={1}>
                    <Icon name="delete" className = "deleteIcon" onClick={()=>this.deleteUser(user)}/> &nbsp;
                    <Icon name="edit" className = "editIcon" onClick={()=>this.editUser(user)}/> 
                  </Table.Cell>
    
                    </Table.Row>
                )}
                </Table.Body>
            </Table>
    
            {this.state.isInternalAccountDetailsOpen &&
               <InternalAccountDetails
                user={this.state.editingUser}
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
    
            <button className="ui vk button" onClick={this.addUser}>
              <i className="user plus icon"></i>
               Add User
            </button>
          <NoData/>
          {this.state.isInternalAccountDetailsOpen &&
            <InternalAccountDetails
                user={this.state.editingUser}
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
