import React, { Component } from 'react'
import {Icon, Modal, Container, Button,Table} from 'semantic-ui-react';
import {api} from '../../../services/api';
import AddNewStudent from './AddNewStudent/AddNewStudent';
import {StudentDetails} from './EditStudentParentData/StudentDetails/StudentDetails';
import {ParentDetails} from './EditStudentParentData/ParentDetails/ParentDetails';
import './admin_StudentsEnrollment.scss'
import { DeleteStudentModal } from './DeleteStudent/DeleteStudent';
import * as toastr from 'toastr';
import Tooltip from '../../Tooltip/Tooltip';

export class AdminStudentsEnrollment extends Component {
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
            open_parentEditModal:false,
            deleteStudentModalOpen: false,
            deleteStudentData: null,
        }
    }

    fetchStudents= async () =>{
        const response = await api.admin.getStudents();
        if (response) {
            this.setState({student_info:response.data})
        }    
    };

    async componentDidMount(){
        await this.fetchStudents()
    };

    //Opens Add Student Modal = AddNewStudent.js component
    addNewStudent = () => {
        this.setState({open_AddModal: true});
    };

    onAddModalClose = () => {
        this.setState({open_AddModal: false});
    };

    renderParent_FirstName = (student, number) => {
        if (student.secondParent && parseInt(number) === 2) {
            return <Table.Cell>{ student.secondParent.FirstName }</Table.Cell>
        } else if (student.firstParent && parseInt(number) === 1) {
            return <Table.Cell>{ student.firstParent.FirstName }</Table.Cell>
        } else {
            return <Table.Cell />
        }
    };

    renderParent_LastName=(student, number)=>{
        if (student.secondParent && parseInt(number) === 2) {
            return <Table.Cell>{ student.secondParent.LastName }</Table.Cell>
        } else if (student.firstParent && parseInt(number) === 1) {
            return <Table.Cell>{ student.firstParent.LastName }</Table.Cell>
        } else {
            return <Table.Cell></Table.Cell>
        }
    };

    renderParent_eMail=(student, number) => {
        if(student.secondParent && parseInt(number) === 2) {
            return <Table.Cell>{ student.secondParent.eMail }</Table.Cell>
        } else if(student.firstParent && parseInt(number) === 1) {
            return <Table.Cell>{ student.firstParent.eMail }</Table.Cell>
        } else {
            return <Table.Cell />
        }
    };
    
    editStudent=(data)=>{
        this.setState({
            editingStudent: data.studentInfo, 
            open_EditModal: true,
            editingStudentParent:data.firstParent,
            editingStudentParent2:data.secondParent,
        });
    }
    
    deleteStudent = (data) => {
        this.setState({ deleteStudentData: data.studentInfo, deleteStudentModalOpen: true })
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

    onDeleteStudentModalClose = () => {
        this.setState({ deleteStudentModalOpen: false });
    }

    onDeleteStudent = async () => {
        const response = await api.admin.removeStudent(this.state.deleteStudentData.ID);
        this.onDeleteStudentModalClose();

        if (response.data.success) {
            await this.fetchStudents();
            toastr.success('Student removed successfully!');
        } else {
            toastr.error(response.data.msg);
        }
    };

    render() {
        console.log(this.state.student_info);
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
            {/* <Button className="google plus" floated="right" disabled>
                <Icon name="upload"/>
                Upload Excel File
            </Button> */}
            <div className='Student_admin'>
            <Table  compact textAlign='center' color="grey" collapsing>
              <Table.Header >
                   <Table.Row >
                        <Table.HeaderCell colSpan="4" className="studentHeader" > Student</Table.HeaderCell>
                        <Table.HeaderCell colSpan="8" className="parentHeader" >Parents</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>FirstName  </Table.HeaderCell>
                        <Table.HeaderCell>LastName </Table.HeaderCell>
                        <Table.HeaderCell>Class </Table.HeaderCell>
                        <Table.HeaderCell className='right-border'></Table.HeaderCell>
                        <Table.HeaderCell>FirstName </Table.HeaderCell>
                        <Table.HeaderCell >LastName </Table.HeaderCell>
                        <Table.HeaderCell >Email </Table.HeaderCell>
                        <Table.HeaderCell className='right-border'></Table.HeaderCell>
                        <Table.HeaderCell>FirstName </Table.HeaderCell>
                        <Table.HeaderCell >LastName </Table.HeaderCell>
                        <Table.HeaderCell >Email </Table.HeaderCell>
                        <Table.HeaderCell> </Table.HeaderCell>    
                    </Table.Row>
              </Table.Header>
              <Table.Body>
           {this.state.student_info.map((student) =>
             <Table.Row>
                 <Table.Cell>{ student.studentInfo.FirstName }  </Table.Cell>
                 <Table.Cell>{ student.studentInfo.LastName }</Table.Cell>
                 <Table.Cell>{ student.studentInfo.ClassId }</Table.Cell>
                 <Table.Cell textAlign="center" className="edit-cell right-border" width={1}>
                     <div style={{display: 'flex'}}>
                        <Tooltip 
                            text="Edit student"
                            trigger={
                                <Icon 
                                    name="edit" 
                                    className="enrlStudEditIcon" 
                                    onClick={() =>this.editStudent(student)}
                                />
                            }
                        />
                        <Tooltip 
                            text="Delete student"
                            trigger={
                                <Icon 
                                    name="delete" 
                                    className="enrlStudDeleteIcon" 
                                    onClick={() =>this.deleteStudent(student)}
                                />
                            }
                        />
                     </div>
                  </Table.Cell>
                  {this.renderParent_FirstName(student,1)}
                  {this.renderParent_LastName(student,1)}
                   {this.renderParent_eMail(student,1)}
                  <Table.Cell textAlign="center" className="edit-cell right-border" width={1}>
                    <Tooltip 
                        text="Edit parent"
                        trigger={
                            <Icon 
                                name="edit" 
                                className="enrlStudEditIcon" 
                                onClick={() =>this.editParent(student.firstParent)}
                            />
                        }
                    />
                  </Table.Cell>
                 {this.renderParent_FirstName(student,2)}
                 {this.renderParent_LastName(student,2)}
                 {this.renderParent_eMail(student,2)}
                 <Table.Cell textAlign="center" className="edit-cell" width={1}>
                     
                    {student.secondParent &&
                        <Tooltip 
                            text="Edit parent"
                            trigger={
                                <Icon 
                                    name="edit"
                                    className="enrlStudEditIcon" 
                                    onClick={() =>this.editParent(student.secondParent)} 
                                />
                            }
                        />
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
                                this.fetchStudents();
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

            {this.state.deleteStudentModalOpen && 
                <DeleteStudentModal 
                    student={this.state.deleteStudentData}
                    onClose={this.onDeleteStudentModalClose} 
                    onDelete={this.onDeleteStudent} 
                />
            }
        </Container>
        )
    }
}

export default AdminStudentsEnrollment;
