import React, { Component } from 'react';
import { api } from '../../../../services/api';
import * as toastr from 'toastr';
import _ from 'lodash';

import {Icon, Modal, Button, Table, Dropdown} from 'semantic-ui-react';
import Tooltip from '../../../Tooltip/Tooltip';

export class TeacherClassDetails extends Component {
    state = {
        isSaving:false,
        teacherID:null,
        FirstName:null,
        LastName:null,
        CSPairs:[],

        classOptions:[],
        subjectOptions:[]
    }

    handleClassChange = (e, value, index) => {
        var array = [...this.state.CSPairs];
        array[index].classId = value.value;
        this.setState({CSPairs: array});
    }

    handleSubjectChange = (e, value, index) => {
        var array = [...this.state.CSPairs];
        array[index].subjectId = value.value;
        this.setState({CSPairs: array});
    }

    onClose = () => {
        if (this.state.isSaving) {
          return;
        }
        this.props.onClose();
    };

    setClassOptions = (dat) =>
        _.times(dat.length, (i) => {
            const name = dat.Name;
            return { key: dat[i].ID, value: dat[i].ID , text: dat[i].Name}
    })
    
    setSubjectOptions = (dat) =>
        _.times(dat.length, (i) => {
            console.log(dat[i]);
            return { key: dat[i].ID, value: dat[i].ID , text: dat[i].Name}
    })
    
    async fetchClasses(){
        const response = await api.admin.getClasslist();
        if (response) {
          this.setState({classOptions: this.setClassOptions(response.data)});
        }
    }

    fetchSubjects = async () => {
        const response = await api.admin.getSubjectslist();
        if(response) {
            this.setState( {subjectOptions: this.setSubjectOptions(response.data)});
        }
    }

    onAddAssociationRow = () => {
        this.setState({CSPairs : [...this.state.CSPairs, {'subjectId':"", 'classId':"" } ]})
    }

    onDeleteAssociationRow = (i) => {
        var array = [...this.state.CSPairs];
        array.splice(i, 1);
        this.setState({CSPairs: array});
    }

    onSave = async () => {
        if (this.state.isSaving) {
          return;
        }
    
        this.setState({isSaving: true});
        
        try {
          const data = {
            teacherId: this.state.teacherID,
            CSPairs: this.state.CSPairs
          };
    
            await api.admin.createTeacherClassAssociation(data);
            toastr.success(`Teacher-suject-class updated successfully.`);
        
        } catch (e) {
          this.setState({isSaving: false});
          return toastr.error(e);
        }
    
        this.setState({isSaving: false});
        this.props.onSave();
      };
    

    async componentDidMount() {
        const {teacher} = this.props;
        
        if (teacher) {
          this.setState({
            teacherID: teacher.ID,
            FirstName: teacher.FirstName,
            LastName: teacher.LastName,

            CSPairs:[{'subjectId':"", 'classId':""}],
          });
        }
        await this.fetchClasses();
        await this.fetchSubjects();
    }

    render() {
        return (
            <Modal dimmer open className="topic-detail" size="small">
                <Modal.Header>
                    <span><Icon name='settings'/>&nbsp;<Icon name='user'/>&nbsp;{this.state.FirstName}&nbsp;{this.state.LastName}</span>
                    <Icon onClick={this.onClose} className="close-icn" name="close" />
                </Modal.Header>
                
                <Modal.Content>
                <Table columns={3}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign="center">Class</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Subject</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center" width={1}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.CSPairs.length > 0 &&
                        this.state.CSPairs.map((data, index) =>
                        <Table.Row key={index}>
                            <Table.Cell>
                                <Dropdown fluid search selection
                                    options={this.state.classOptions}
                                    placeholder='Select Class'
                                    name='class'
                                    value={this.state.CSPairs[index].classId}
                                    onChange={(e, {value}) => {this.handleClassChange(e, {value}, index)} }
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <Dropdown fluid search selection
                                    options={this.state.subjectOptions}
                                    placeholder='Select Subject'
                                    name='subject'
                                    value={this.state.CSPairs[index].subjectId}
                                    onChange={(e, {value}) => {this.handleSubjectChange(e, {value}, index)}}
                                />
                            </Table.Cell>
                            <Table.Cell textAlign="center" width={1}>
                                {(index >= 1) && <Tooltip 
                                    text="Delete"
                                    trigger={
                                        <Button circular icon='cancel' style={{padding:"5px"}}
                                        onClick={()=>this.onDeleteAssociationRow(index)} /> 
                                    }
                                />
                                }
                            </Table.Cell>
                        </Table.Row>
                        )}
                    </Table.Body>

                    <Table.Footer fullWidth>
                    <Table.Row>
                       
                    
                    <Table.HeaderCell colSpan='4' textAlign="center">
                        <Button  size='small' fluid color="vk" onClick={this.onAddAssociationRow}>
                        <span><Icon name='plus' /> Add Association</span>
                        </Button>

                    </Table.HeaderCell>
                    
                    </Table.Row>
                </Table.Footer>
                </Table>
                </Modal.Content>
                
                <Modal.Actions>
                <Button positive onClick={this.onSave}>
                    <Icon name='checkmark' /> Confirm
                </Button>
                </Modal.Actions>
            </Modal>
        )
    }

}

export default TeacherClassDetails