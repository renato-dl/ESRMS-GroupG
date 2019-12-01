import React, { Component } from 'react'
import {Icon, Modal, Container, Button,Table} from 'semantic-ui-react';
import {api} from '../../../services/api';
//import moment from 'moment';

import AddNewStudent from './AddNewStudent/AddNewStudent';
//import student from '../../../../../src/database/models/student';
//import { NoData } from '../../NoData/NoData';

export class admin_StudentsEnrollment extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            studentInfo:{
            },
            open_AddModal: false,
            open_EditModal: false,
            student_info:[]
        }
      }
    
      async componentDidMount(){
        const {params} = this.props.match;
        const response = await api.admin.getStudents();
        console.log(response)
        if (response) {
           this.setState({student_info:response.data})
          }     
      }

    //Opens Add Student Modal = AddNewStudent.js component
    addNewStudent = () => {
        this.setState({open_AddModal: true});
    };

    onAddModalClose = () => {
        this.setState({open_AddModal: false});
    };

    render() {
        return (
            <Container className="contentContainer">
                <h3 className="contentHeader">
                    <Icon name='braille'/>
                    Students Configuration
                </h3>
            <Button className="ui vk button" onClick={this.addNewStudent}>
                <i className="user plus icon"></i>
                Enroll a Student
            </Button>
            <Button className="google plus" floated="right" disabled>
                <Icon name="upload"/>
                Upload Excel File
            </Button>
            <Table className='Student_admin' columns={10} textAlign='center'>
              <Table.Header >
                   <Table.Row>
                        <Table.HeaderCell colSpan="4" > Student</Table.HeaderCell>
                        <Table.HeaderCell colSpan="6" >Parent</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>FirstName  </Table.HeaderCell>
                        <Table.HeaderCell>LastName </Table.HeaderCell>
                        <Table.HeaderCell>ClassId </Table.HeaderCell>
                        <Table.HeaderCell>FirstName </Table.HeaderCell>
                        <Table.HeaderCell >LastName </Table.HeaderCell>
                        <Table.HeaderCell >Email </Table.HeaderCell>
                        <Table.HeaderCell>FirstName </Table.HeaderCell>
                        <Table.HeaderCell >LastName </Table.HeaderCell>
                        <Table.HeaderCell >Email </Table.HeaderCell>
                    </Table.Row>
              </Table.Header>
              <Table.Body>
           {this.state.student_info.map((student) =>
             <Table.Row>
                 <Table.Cell>{ student.studentInfo.FirstName }  </Table.Cell>
                 <Table.Cell>{ student.studentInfo.LastName }</Table.Cell>
                 <Table.Cell>{ student.studentInfo.ClassId }</Table.Cell>
                 <Table.Cell>{ student.firstParent.FirstName }  </Table.Cell>
                 <Table.Cell>{ student.firstParent.LastName }</Table.Cell>
                 <Table.Cell>{ student.firstParent.eMail }</Table.Cell>
                 {/* <Table.Cell>{ student.secondParent.FirstName}</Table.Cell>
                 <Table.Cell>{ student.secondParent.LastName }</Table.Cell>
                 <Table.Cell>{ student.secondParent.eMail }</Table.Cell>  */}
             </Table.Row>
           )} 
           </Table.Body>
           </Table>
            
           
            
            {this.state.open_AddModal &&
                <Modal dimmer open className="topic-detail" size="small">
                    <Modal.Header>
                        <span>STUDENT ENROLLMENT</span>
                        <Icon onClick={this.onAddModalClose} className="close-icn" name="close" />
                    </Modal.Header>
                    <Modal.Content>
                        <AddNewStudent
                            ConfirmEnrollment={() => {
                                //refresh enrolled students table
                                this.onAddModalClose();
                            }}/>
                    </Modal.Content>
                </Modal>
            }
            </Container>
        )
    }
}

export default admin_StudentsEnrollment
