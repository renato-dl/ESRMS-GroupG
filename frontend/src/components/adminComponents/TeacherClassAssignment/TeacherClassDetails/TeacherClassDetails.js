import React, { Component } from 'react';
import { api } from '../../../../services/api';
import * as toastr from 'toastr';
import _ from 'lodash';


import IsTeacher from '../../../../assets/images/iconTeacher.jpg';
import {Icon, Modal, Button, Table, Dropdown, Header, Image, Divider} from 'semantic-ui-react';
import Tooltip from '../../../Tooltip/Tooltip';

export class TeacherClassDetails extends Component {
    state = {
        isSaving:false,
        errMsg:false,
        teacherID:null,
        //FirstName:null,
        //LastName:null,
        CSPairs:[],

        classOptions:[],
        subjectOptions:[],
        teacherOptions:[]
    }

    hasEmptySelectbox = () => {
        let r = false;
         this.state.CSPairs.map(obj =>{ 
            for (var prop in obj) { 
                if (obj[prop] === null || obj[prop] === '') { 
                    this.setState({errMsg: true});
                    r = true; 
                } 
            }
         }); 
         
         this.setState({errMsg: r});
         return r;
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

    handleTeacherChange = (e, value) =>{
        this.setState({teacherID: value.value})
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
            return { key: dat[i].ID, value: dat[i].ID , text: dat[i].Name}
    })

    setTeacherOptions = (dat) =>
        _.times(dat.length, (i) => {
            return { key: dat[i].ID, value: dat[i].ID , text: dat[i].FirstName +" "+ dat[i].LastName, icon: 'user outline'}
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
        
        if (this.state.isSaving || this.hasEmptySelectbox()) {
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
        const teacherAll = this.props;
        if (teacherAll) {
          this.setState({
            teacherOptions:this.setTeacherOptions(teacherAll.teacherAll),
            CSPairs:[{'subjectId':"", 'classId':""}],
          });
        }
        await this.fetchClasses();
        await this.fetchSubjects();
    }

    render() {
        return (
            <Modal dimmer open className="topic-detail" size="tiny">
                <Modal.Header>
                    New associations
                    <Icon onClick={this.onClose} className="close-icn" name="close" />
                </Modal.Header>
                
                <Modal.Content>
                    <Divider horizontal> <Header as='h4' color="grey" style={{width: "55px"}}>Techer</Header></Divider>
                    <Header as='h4' style={{borderBottom: '3px solid #4d7198', paddingBottom: '15px', margin:"0"}}>
                        <Image avatar src={IsTeacher} style={{marginRight:"10px"}}/>
                        <Dropdown
                            fluid
                            search
                            selection
                            options={this.state.teacherOptions}
                            placeholder='Set Teacher'
                            onChange={(e, {value}) => {this.handleTeacherChange(e, {value})}}
                        />
                    </Header>
                    <Divider horizontal><Header as='h4' color="grey" style={{width: "92px"}}>Associations</Header></Divider>

                    <Table columns={3} basic="very">
                    <Table.Body>
                        {this.state.CSPairs.length > 0 &&
                        this.state.CSPairs.map((data, index) =>
                        <Table.Row key={index}>
                            <Table.Cell>
                                <Dropdown fluid search selection
                                    options={this.state.classOptions}
                                    placeholder='Set Class'
                                    name='class'
                                    value={this.state.CSPairs[index].classId}
                                    onChange={(e, {value}) => {this.handleClassChange(e, {value}, index)} }
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <Dropdown fluid search selection
                                    options={this.state.subjectOptions}
                                    placeholder='Set Subject'
                                    name='subject'
                                    value={this.state.CSPairs[index].subjectId}
                                    onChange={(e, {value}) => {this.handleSubjectChange(e, {value}, index)}}
                                />
                            </Table.Cell>
                            <Table.Cell textAlign="center" width={1}>
                                <Tooltip 
                                    text="Delete"
                                    trigger={
                                        <Button basic icon='cancel' style={{padding:"3px"}} disabled={index===0}
                                        onClick={()=>this.onDeleteAssociationRow(index)} /> 
                                    }
                                />
                            </Table.Cell>
                        </Table.Row>
                        )}
                    </Table.Body>

                    <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='4' textAlign="center">
                            <Button  size='small' fluid color='vk' onClick={this.onAddAssociationRow}>
                            <span><Icon name='plus' /> Add</span>
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
                </Table>
                { this.state.errMsg && 
                <p style={{color:'#CB2431'}}><Icon name="exclamation triangle"/>
                    Please make sure that all fields are selected before confirmation or delete unnecessary rows.
                </p>
                }
                </Modal.Content>
                
                <Modal.Actions>
                <Button positive onClick={this.onSave} disabled={!this.state.teacherID || !this.state.CSPairs.length}>
                    <Icon name='checkmark' /> Save
                </Button>
                </Modal.Actions>
            </Modal>
        )
    }

}

export default TeacherClassDetails