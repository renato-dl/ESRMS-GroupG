import React, { Component } from 'react'

import { api } from '../../services/api';

import {Table, Icon, Container} from 'semantic-ui-react';
import moment from 'moment';

import { NoData } from '../NoData/NoData';
import InternalAccountDetails from './InternalAccountDetails/InternalAccountDetails';


export class InternalAccounts extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          authUsers: [
              {eMail: 'sad', FirstName:"kjhg", LastName: "oijlk", SSN: "kj", CreatedOn: "22.04.2019", IsTeacher: "0", IsParent: "0", IsAdminIfficer: "1", IsPrincipal: "0"},

          ],
          isInternalAccountDetailsOpen: false
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

    async deleteUser (user) {
        const response=await api.sysadmin.deleteUser(user)
        if (response) {
         this.fetchUsers();
        } 
       
    };

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
