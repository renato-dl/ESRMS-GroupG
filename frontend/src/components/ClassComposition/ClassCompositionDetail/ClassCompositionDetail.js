import React, { Component } from 'react';
import {Button, Modal, Checkbox, Icon, Table, Grid} from 'semantic-ui-react';
import "./ClassCompositionDetail.scss";
import { api } from '../../../services/api';
import * as toastr from 'toastr';

export class ClassCompositionDetail extends Component {
  state = {
    students: [],
    enrolledStudents: [],
    toEnrollStudents: [],
    checkedStudents: 0,
    enrolledStudentsCnt: 0,
    toRemoveStudents: [],
    removedStudentsCount: 0,
    isSaving: false, 
    isRemoving: false,
  };

  async componentDidMount() {
    await this.fetchStudents();
  };

  fetchStudents = async () => {
    try {
      const apis = [
        api.admin.getStudentsToEnroll({ isAssigned: 0 }), 
        api.admin.getEnrolledStudentsByClass({classId: this.props.classId})
      ];

      const [toEnrollStudents, alreadyEnrolledStudents] = await Promise.all(apis);
      // console.log(toEnrollStudents, alreadyEnrolledStudents);

      this.setState({
        students: toEnrollStudents.data,
        enrolledStudents: alreadyEnrolledStudents.data,
        enrolledStudentsCnt: alreadyEnrolledStudents.data.length
      });
    } catch (err) {
      this.setState({ students: [], enrolledStudents: [] });
    }
  };

  onRemoved = (e) => {
    let toRemoveStudents = [...this.state.toRemoveStudents];
    let removedStudentsCount = this.state.removedStudentsCount;
    let enrolledStudentsCnt = this.state.enrolledStudentsCnt;

    if (!toRemoveStudents.includes(e)) {
      enrolledStudentsCnt -= 1;
      removedStudentsCount += 1;

      toRemoveStudents.push(e);
    } else {
      enrolledStudentsCnt += 1;
      removedStudentsCount -= 1;

      toRemoveStudents = toRemoveStudents.filter((s) => s !== e);
    }
    
    this.setState({ toRemoveStudents,  enrolledStudentsCnt, removedStudentsCount });
  }

  onRemoveStudents = async () => {
    if (this.state.isRemoving) {
      return;
    }

    this.setState({isRemoving: true});

    const studentIds = this.state.toRemoveStudents;
    const removeStudentsPromises = studentIds.map((id) => api.admin.removeStudentClassAssignment(id));
    
    try {
      await Promise.all(removeStudentsPromises);
      toastr.success("Students removed successfully!");
    } catch(err) {
      toastr.error(err);
    }

    this.setState({ isRemoving: false, removedStudentsCount: 0, toRemoveStudents: [] });
    await this.fetchStudents();
  }

  onChecked = (e) => {
    let newStudents = [...this.state.toEnrollStudents];
    let count = this.state.checkedStudents;

    if (!newStudents.includes(e)) {
      count += 1;
      newStudents.push(e);
    }
    else {
      count -= 1;
      newStudents = newStudents.filter((s) => s !== e);
    }
    
    this.setState({ toEnrollStudents : newStudents, checkedStudents: count })
  }

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    const classId = this.props.classId;
    const studentIds = { students: this.state.toEnrollStudents };

    try {
      await api.admin.sendStudentsToEnrollToClass(classId, studentIds);
      toastr.success("Students enrolled successfully!"); 
    } catch(e) {
      toastr.error(e);
    }

    this.setState({ 
      isSaving: false, 
      students: [], 
      toEnrollStudents: [],
      checkedStudents: 0 
    });
    await this.fetchStudents();
  }

  onClose = () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({
      enrolledStudents: [],
      students: [],
      toEnrollStudents: [],
      checkedStudents: 0,
      enrolledStudentsCnt: 0, 
      removedStudentsCount: 0,
      toRemoveStudents: []
    })

    this.props.onClose();
  };

  render() {
    return (
      <Modal dimmer open className="class-composition-detail" size="small">
          <Modal.Header>
            <span>Enroll students to: &nbsp;&nbsp; class &nbsp; {this.props.className}</span>
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
                      this.state.enrolledStudents.map((eStudent, index) => (              
                        <Table.Row key={index} className={
                          this.state.toRemoveStudents.indexOf(eStudent.ID) !== -1 ? 'removed-student' : 'not-removed-student'
                        }>
                          <Table.Cell textAlign="left">{ eStudent.FirstName }</Table.Cell>
                          <Table.Cell textAlign="left">{ eStudent.LastName }</Table.Cell>
                          <Table.Cell textAlign="left" width={1}>
                              <Icon onClick={(e) => this.onRemoved(eStudent.ID)} className="close-icn" name="close" />
                              </Table.Cell>
                        </Table.Row>  
                      ))}
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
                          onClick={this.onRemoveStudents}
                          disabled={!this.state.removedStudentsCount}>
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
                        {this.state.students.length >= 1 && this.state.students.map((student, index) =>
                            <Table.Row key={index}>
                              <Table.Cell textAlign="left">{ student.FirstName }</Table.Cell>
                              <Table.Cell textAlign="left">{ student.LastName }</Table.Cell>
                              <Table.Cell textAlign="left" width={1}>
                                <Checkbox onChange={
                                  (e) => this.onChecked(student.ID)}/>
                              </Table.Cell> 
                            </Table.Row>
                          )}
                          {this.state.students.length === 0 && 
                            <Table.Row>
                              <Table.Cell style={{width: '100%'}}>
                                <p>No students to enroll.</p>
                              </Table.Cell>
                            </Table.Row>
                          }
                          <Table.Row>
                            <Table.Cell colSpan='3' textAlign="center">
                              <Button positive 
                              onClick={this.onSave} 
                              disabled={!this.state.checkedStudents}>
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
        <Modal.Actions />
      </Modal>
    )
  }
}

export default ClassCompositionDetail
