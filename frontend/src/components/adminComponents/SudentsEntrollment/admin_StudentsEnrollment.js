import React, { Component } from 'react'
import {Icon, Modal, Container, Button,Table} from 'semantic-ui-react';
import {api} from '../../../services/api';
//import moment from 'moment';

import AddNewStudent from './AddNewStudent/AddNewStudent';
//import student from '../../../../../src/database/models/student';
import { NoData } from '../../NoData/NoData';
import {StudentDetails} from './EditStudentParentData/StudentDetails/StudentDetails';
import {ParentDetails} from './EditStudentParentData/ParentDetails/ParentDetails';
import './admin_StudentsEnrollment.scss'

export class admin_StudentsEnrollment extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            enrolledStudents:[],
            open_AddModal: false,
            open_EditModal: false,
            student_info:[],
            editingStudent:null,
            editingStudentParent:null,
            editingStudentParent2:null,
            editingParent:null,
            open_parentEditModal:false
        }
      }

      fetchStudents= async () =>{
        const {params} = this.props.match;
        const response = await api.admin.getStudents();
        console.log(response)
        if (response) {
           this.setState({student_info:response.data})
          }    
      };
      async componentDidMount(){
        this.fetchStudents()
      };

    //Opens Add Student Modal = AddNewStudent.js component
    addNewStudent = () => {
        this.setState({open_AddModal: true});
    };

    onAddModalClose = () => {
        this.setState({open_AddModal: false});
    };

    renderParent_FirstName=(student,number)=>{
        if(student.secondParent&&number==2)
            return <Table.Cell>{ student.secondParent.FirstName }  </Table.Cell>
        else if(student.firstParent&&number==1)
            return <Table.Cell>{ student.firstParent.FirstName }  </Table.Cell>
        else return <Table.Cell>  </Table.Cell>
    };

    renderParent_LastName=(student,number)=>{
        if(student.secondParent&&number==2)
            return <Table.Cell>{ student.secondParent.LastName }  </Table.Cell>
        else if(student.firstParent&&number==1)
            return <Table.Cell>{ student.firstParent.LastName }  </Table.Cell>
        else return <Table.Cell>  </Table.Cell>
    };

    renderParent_eMail=(student,number)=>{
        if(student.secondParent&&number==2)
            return <Table.Cell>{ student.secondParent.eMail }  </Table.Cell>
        else if(student.firstParent&&number==1)
            return <Table.Cell>{ student.firstParent.eMail }  </Table.Cell>
        else return <Table.Cell>  </Table.Cell>
    };
    editStudent=(data)=>{
        this.setState({
            editingStudent: data.studentInfo, 
            open_EditModal: true,
            editingStudentParent:data.firstParent,
            editingStudentParent2:data.secondParent,
        });
    }
    onStudentDetailClose = () => {
        this.setState({editingStudent: null, open_EditModal: false});
    }

    editParent=(data)=>{
        this.setState({editingParent: data, open_parentEditModal: true});
    }
    addParent=()=>{
        console.log('add parent')
    }
    
    onParentDetailClose = () => {
        this.setState({editingParent: null, open_parentEditModal: false});
    }

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
            <h1 />

            <div className='Student_admin'>
            <Table  columns={12} textAlign='center'>
              <Table.Header >
                   <Table.Row >
                        <Table.HeaderCell colSpan="4"  > Student</Table.HeaderCell>
                        <Table.HeaderCell colSpan="8"  >Parent</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>FirstName  </Table.HeaderCell>
                        <Table.HeaderCell>LastName </Table.HeaderCell>
                        <Table.HeaderCell>ClassId </Table.HeaderCell>
                        <Table.HeaderCell className='right-border'>Opreation </Table.HeaderCell>
                        <Table.HeaderCell>FirstName </Table.HeaderCell>
                        <Table.HeaderCell >LastName </Table.HeaderCell>
                        <Table.HeaderCell >Email </Table.HeaderCell>
                        <Table.HeaderCell className='right-border'>Opreation </Table.HeaderCell>
                        <Table.HeaderCell>FirstName </Table.HeaderCell>
                        <Table.HeaderCell >LastName </Table.HeaderCell>
                        <Table.HeaderCell >Email </Table.HeaderCell>
                        <Table.HeaderCell>Opreation </Table.HeaderCell>    
                    </Table.Row>
              </Table.Header>
              <Table.Body>
           {this.state.student_info.map((student) =>
             <Table.Row>
                 <Table.Cell>{ student.studentInfo.FirstName }  </Table.Cell>
                 <Table.Cell>{ student.studentInfo.LastName }</Table.Cell>
                 <Table.Cell>{ student.studentInfo.ClassId }</Table.Cell>
                 <Table.Cell textAlign="left" className="edit-cell right-border" width={1}>
                    <Icon name="edit" onClick={() =>this.editStudent(student)}/> Edit
                  </Table.Cell>
                  {this.renderParent_FirstName(student,1)}
                  {this.renderParent_LastName(student,1)}
                   {this.renderParent_eMail(student,1)}
                 <Table.Cell textAlign="left" className="edit-cell right-border" width={1}>
                    <Icon name="edit" onClick={() =>this.editParent(student.firstParent)}/> Edit
                  </Table.Cell>
                 {this.renderParent_FirstName(student,2)}
                 {this.renderParent_LastName(student,2)}
                 {this.renderParent_eMail(student,2)}
                 <Table.Cell textAlign="left" className="edit-cell" width={1}>
                 {!student.secondParent && 
                 <Icon name="plus" onClick={() =>this.addParent(student.studentInfo)}> Add </Icon>
                 }    
                 {student.secondParent &&
                 <Icon name="edit"onClick={() =>this.editParent(student.secondParent)}> Edit </Icon>
                 }
                 </Table.Cell>
             </Table.Row>
           )} 
           </Table.Body>
           </Table>
           </div>
            
            
            
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
            {this.state.editingStudent &&
            <StudentDetails
              studentInfo={this.state.editingStudent}
              parentInfo={this.state.editingStudentParent}
              parentInfo2={this.state.editingStudentParent2}
              onClose={this.onStudentDetailClose}
              onSave={() => {
                this.fetchStudents();
                this.onStudentDetailClose();
              }}
            />
          }
           {this.state.editingParent &&
            <ParentDetails
              parentInfo={this.state.editingParent}
              onClose={this.onParentDetailClose}
              onSave={() => {
                this.fetchStudents();
                this.onParentDetailClose();
              }}
            />
          }
            </Container>
        )
    }
}

export default admin_StudentsEnrollment
