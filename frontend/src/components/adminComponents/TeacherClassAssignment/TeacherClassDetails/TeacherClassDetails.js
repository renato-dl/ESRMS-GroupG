import React, { Component } from 'react';
import { api } from '../../../../services/api';

import {Icon, Modal, Button, Table, Dropdown} from 'semantic-ui-react';
import Tooltip from '../../../Tooltip/Tooltip';

export class TeacherClassDetails extends Component {
    state = {
        isSaving:false,
        teacherID:null,
        FirstName:null,
        LastName:null,
        classOptions:[  { key: 'af', value: '1A', text: '1A' },
                        { key: 'ax', value: '2B', text: '2B' }
                        ]

        ,
        subjectOptions:[
                        { key: 'm', value: 'm', text: 'Mathematics' },
                        { key: 'h', value: 'h', text: 'History' }
        ]
    }

    onClose = () => {
        if (this.state.isSaving) {
          return;
        }
        this.props.onClose();
    };

    componentDidMount() {
        const {teacher} = this.props;
        
        if (teacher) {
          this.setState({
            teacherID: teacher.ID,
            FirstName: teacher.FirstName,
            LastName: teacher.LastName,

            CSPairs:[],
          });
        }
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
        