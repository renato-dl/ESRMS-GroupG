import React, { Component } from 'react';
import { api } from '../../../../services/api';
import _ from 'lodash';

import {Icon, Modal, Button, Table, Dropdown} from 'semantic-ui-react';
import Tooltip from '../../../Tooltip/Tooltip';

export class TeacherClassDetails extends Component {
    state = {
        isSaving:false,
        teacherID:null,
        FirstName:null,
        LastName:null,
        CSPairs:[{subjectId:null, classId:null}],

        classOptions:[],
        subjectOptions:[
                        { key: '1', value: '1', text: 'Mathematics' },
                        { key: '2', value: '2', text: 'Geography' },
                        { key: '3', value: '3', text: 'Physics'},
                        { key: '4', value: '4', text: 'History'},
                        { key: '5', value: '5', text: 'Physical Education'},
                        { key: '6', value: '6', text: 'Italian'},
                        { key: '7', value: '7', text: 'English'},
        ]
    }

    onClose = () => {
        if (this.state.isSaving) {
          return;
        }
        this.props.onClose();
    };

    setClassOptions = (dat) =>
        _.times(dat.length, (i) => {
            //console.log(dat[i]);
            const name = dat.Name;
            return { key: dat[i].ID, value: dat[i].ID , text: dat[i].Name}
    })
    
    setSubjectOptions = (dat) =>
        _.times(dat.length, (i) => {
            console.log(dat[i]);
            //const name = dat.Name;
            return { key: dat[i].ID, value: dat[i].ID , text: dat[i].Name}
    })
    
    async fetchClasses(){
        const response = await api.admin.getClasslist();
        if (response) {
          //console.log(response)
          //this.setState({classes:response.data})
          this.setState({classOptions: this.setClassOptions(response.data)});
        } 
    }

    fetchSubjects = async () => {
        const response = await api.admin.getSubjectslist();
        if(response) {
            this.setState( {subjectOptions: this.setSubjectOptions(response.data)});
        }
    }

    async componentDidMount() {
        const {teacher} = this.props;
        
        if (teacher) {
          this.setState({
            teacherID: teacher.ID,
            FirstName: teacher.FirstName,
            LastName: teacher.LastName,

            CSPairs:[],
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
                        <Table.Row>
                            <Table.Cell>
                                <Dropdown fluid search selection
                                    options={this.state.classOptions}
                                    placeholder='Select Class'
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <Dropdown fluid search selection
                                    options={this.state.subjectOptions}
                                    placeholder='Select Subject'
                                />
                            </Table.Cell>
                            <Table.Cell textAlign="right" width={1}>
                                <Tooltip 
                                    text="Delete"
                                    trigger={
                                        <Button circular icon='cancel' style={{padding:"5px"}}
                                        onClick={()=>this.deleteRow()} /> 
                                    }
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>

                    <Table.Footer fullWidth>
                    <Table.Row>
                       
                    
                    <Table.HeaderCell colSpan='4' textAlign="center">
                        <Button  size='small' fluid color="vk">
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
        