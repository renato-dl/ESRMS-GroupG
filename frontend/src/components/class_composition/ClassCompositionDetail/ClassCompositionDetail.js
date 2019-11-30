import React, { Component } from 'react';
import {Button, Modal, Checkbox, Icon, Table, Grid} from 'semantic-ui-react';
import { api } from '../../../services/api';

export class ClassCompositionDetail extends Component {
  state = {
    classId: null,
    className: null, 
    students: [],
    enrolledStudents: [],
    toEnrollStudents: [],
    checkedStudents: 0,
    isSaving: false
  };

  async componentDidMount() {
    const request = { isAssigned: true };
    const toEnrollStudents = await api.admin.getStudentsToEnroll(request);
    if (toEnrollStudents) {
      this.setState({ students: toEnrollStudents.data })
    } 
    this.setState({
      classId: this.props.classId,
      className: this.props.className,
      enrolledStudents: this.props.enrolledStudents
    });
  };

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

    const requestParams = {
      classId : this.state.classId,
      studentIds: this.state.toEnrollStudents
    }

    this.setState({isSaving: false});
    this.props.onSave();
  }

  onClose = () => {
    if (this.state.isSaving) {
      return;
    }

    this.props.onClose();
  };

  render() {
    return (
      <Modal dimmer open className="class-composition-detail" size="small">
      <Modal.Header>
        <span>Enroll students to class {this.state.className}</span>
        <Icon onClick={this.onClose} className="close-icn" name="close" />
      </Modal.Header>
      <Modal.Content>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
            <Table columns={2}>
              <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='2'>Enrolled students</Table.HeaderCell>     
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Surname</Table.HeaderCell>         
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan="2"><p>No students yet</p></Table.Cell>                  
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
                        <Table.Cell colSpan='3'>
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
        {/* <Button positive onClick={this.onSave} disabled={!this.state.title || !this.state.description || !this.state.date}>
          <Icon name='checkmark' /> Save
        </Button> */}

      </Modal.Actions>
    </Modal>
    )
  }
}

export default ClassCompositionDetail
