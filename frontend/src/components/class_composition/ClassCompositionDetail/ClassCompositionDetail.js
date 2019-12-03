import React, { Component } from 'react';
import {Button, Modal, Checkbox, Icon, Table, Grid} from 'semantic-ui-react';
import "./ClassCompositionDetail.scss";
import { api } from '../../../services/api';
import * as toastr from 'toastr';

export class ClassCompositionDetail extends Component {
  state = {
    classId: null,
    className: null, 
    students: [],
    enrolledStudents: [],
    toEnrollStudents: [],
    checkedStudents: 0,
    enrolledStudentsCnt: 0,
    toRemoveStudents: [],
    styleRemoveStudents: new Map(),
    removedStudents: 0,
    isSaving: false, 
    isRemoving: false,
  };

  async componentDidMount() {
    this.setState({
      classId: this.props.classId,
      className: this.props.className
    });
    this.fetchToEnrollStudents();
    this.fetchEnrolledStudents();
  };

  async fetchToEnrollStudents(){
    try{
      const request = { isAssigned: 0 };
      const toEnrollStudents = await api.admin.getStudentsToEnroll(request);
      if (toEnrollStudents) {
        this.setState({ students: toEnrollStudents.data });
      } 
    }
    catch(e){
      this.setState({ students: [] });
    } 
  }

  async fetchEnrolledStudents(){
    try {
      const classRequest = { classId: this.props.classId };
      const alreadyEnrolledStudents = await api.admin.getEnrolledStudentsByClass(classRequest);
      const studentsMap = new Map();
      if(alreadyEnrolledStudents){
        this.setState({enrolledStudents: alreadyEnrolledStudents.data,
          enrolledStudentsCnt: alreadyEnrolledStudents.data.length });
        alreadyEnrolledStudents.data.forEach(element => {
          studentsMap.set(element.ID, 'not-removed-student');
        });
        this.setState({ styleRemoveStudents: studentsMap});
      } 
    }
    catch(e){
      this.setState({enrolledStudents: []});
    }  
  }

  onRemoved = (e) => {
    const removedStudents = this.state.toRemoveStudents;
    const styleStudents = this.state.styleRemoveStudents;
    let countRemoved = this.state.removedStudents;
    let count = this.state.enrolledStudentsCnt;
    if (!removedStudents.includes(e)){
      count = count - 1;
      countRemoved = countRemoved + 1;
      removedStudents.push(e);
      styleStudents.set(e, 'removed-student');
    }
    else{
      count = count + 1;
      countRemoved =  countRemoved - 1;
      removedStudents.splice( removedStudents.indexOf(e), 1 );
      styleStudents.set(e, 'not-removed-student');
    }
      
    this.setState({ toRemoveStudents : removedStudents, 
      enrolledStudentsCnt: count, removedStudents: countRemoved })
  }

  onRemoveStudents = async () => {
    if (this.state.isRemoving) {
      return;
    }

    this.setState({isRemoving: true});

    const studentIds = this.state.toRemoveStudents;

    studentIds.forEach(async (student) =>{
      try{
        const response = await api.admin.removeStudentClassAssignment(student);
        toastr.success("Student removed successfully!");
      }
      catch(e){
        toastr.error(e);
      }
    });
    this.setState({isRemoving: false});
    this.fetchEnrolledStudents();
    this.fetchToEnrollStudents();
  }

  onChecked = (e) => {
    const newStudents = this.state.toEnrollStudents;
    let count = this.state.checkedStudents;
    if (!newStudents.includes(e)){
      count = count + 1;
      newStudents.push(e);
    }
    else{
      count = count - 1;
      newStudents.splice( newStudents.indexOf(e), 1 );
    }
      
  this.setState({ toEnrollStudents : newStudents, checkedStudents: count })
  }

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    const classId = this.state.classId;
    const studentIds = { students: this.state.toEnrollStudents };

    try{
      await api.admin.sendStudentsToEnrollToClass(classId, studentIds);
      toastr.success("Students enrolled successfully!");
    }
    catch(e){
      toastr.error(e);
    }    

    this.setState({isSaving: false});
    this.props.onSave();
  }

  onClose = () => {
    if (this.state.isSaving) {
      return;
    }
    this.setState({
      classId: null, 
      className: null, 
      enrolledStudents: [],
      students: [],
      toEnrollStudents: [],
      checkedStudents: 0,
      enrolledStudentsCnt: 0, 
      removedStudents: 0,
      toRemoveStudents: []
    })
    this.props.onClose();
  };

  render() {
    return (
      <Modal dimmer open className="class-composition-detail" size="small">
      <Modal.Header>
        <span>Enroll students to: &nbsp;&nbsp; class &nbsp; {this.state.className}</span>
        <Icon onClick={this.onClose} className="close-icn" name="close" />
      </Modal.Header>
      <Modal.Content>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
            <Table columns={2}>
              <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='3'>Enrolled students: {this.state.enrolledStudentsCnt}
                    </Table.HeaderCell>     
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Surname</Table.HeaderCell>    
                    <Table.HeaderCell>Remove</Table.HeaderCell>       
                </Table.Row>
              </Table.Header>
              <Table.Body>
                  {this.state.enrolledStudents.length > 0 && 
                  this.state.enrolledStudents.map((eStudent, index) =>                   
                    <Table.Row key={index} className={this.state.styleRemoveStudents.get(eStudent.ID)}>
                      <Table.Cell textAlign="left">{ eStudent.FirstName }</Table.Cell>
                      <Table.Cell textAlign="left">{ eStudent.LastName }</Table.Cell>
                      <Table.Cell textAlign="left" width={1}>
                          <Icon onClick={(e) => this.onRemoved(eStudent.ID)} 
                          className="close-icn" name="close" />
                          </Table.Cell>
                    </Table.Row>                                        
                  )}
                  {this.state.enrolledStudents.length <= 0 &&
                    <Table.Row>
                      <Table.Cell>
                        <p>No students yet.</p>
                      </Table.Cell>
                    </Table.Row>
                  }    
                  <Table.Row>
                    <Table.Cell colSpan='3' textAlign="center">
                      <Button positive 
                      onClick={() => {this.onRemoveStudents();
                        this.fetchEnrolledStudents();
                        this.fetchToEnrollStudents();} }
                      disabled={this.state.removedStudents === 0}>
                        Remove students
                      </Button>
                    </Table.Cell>                        
                  </Table.Row>                                
              </Table.Body>
            </Table>
            </Grid.Column>
            <Grid.Column>
              <Table columns={3}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan='3'>
                      Selected students to enroll: {this.state.checkedStudents}
                    </Table.HeaderCell>        
                  </Table.Row>
                  <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Surname</Table.HeaderCell> 
                      <Table.HeaderCell>Enroll</Table.HeaderCell>        
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.state.students.map((student, index) =>
                        <Table.Row key={index}>
                          <Table.Cell textAlign="left">{ student.FirstName }</Table.Cell>
                          <Table.Cell textAlign="left">{ student.LastName }</Table.Cell>
                          <Table.Cell textAlign="left" width={1}>
                            <Checkbox onChange={
                              (e) => this.onChecked(student.ID)}/>
                          </Table.Cell>
                        </Table.Row>
                      )}
                      <Table.Row>
                        <Table.Cell colSpan='3' textAlign="center">
                          <Button positive 
                          onClick={this.onSave} 
                          disabled={this.state.checkedStudents === 0}>
                            Enroll students
                          </Button>
                        </Table.Cell>                        
                      </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>   
        </Grid>  
      </Modal.Content>
      <Modal.Actions> 
      </Modal.Actions>
    </Modal>
    )
  }
}

export default ClassCompositionDetail
