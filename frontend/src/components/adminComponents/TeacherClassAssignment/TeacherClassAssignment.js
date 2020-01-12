import React, { Component } from 'react';
import { api } from '../../../services/api';
import {Icon, Container, Table, Divider, Header, Button} from 'semantic-ui-react';

//import IsTeacher from '../../../assets/images/iconTeacher.jpg';
//import * as toastr from 'toastr';

import { NoData } from '../../NoData/NoData';
import Tooltip from '../../Tooltip/Tooltip';
import TeacherClassDetails from './TeacherClassDetails/TeacherClassDetails';
import TeacherClassDelete from './TeacherClassDetails/TeacherClassDelete';

export class TeacherClassAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen:false,
            deleteModalOpen:false,
            associationId:null,
            editingTeacher:null, 

            teachersDat:[],
            freeTeachers:[]
        }
    }
    
    fetchTeacherClassData =  async () => {
        const response = await api.admin.getAllTeacherClassData();
        if (response) {
            this.setState({ teachersDat: response.data});
        }
    };

    fetchFreeTeachers = async () => {
        const response = await api.admin.getTeachers('?coordinators=true'); // still something wrong here.. Giulia tesori has class subject but still appears in free 
        if (response) {
            console.log(response);
            if (response.data.message){
                return;
            }
            this.setState({ freeTeachers: response.data});
        }
    };

    async componentDidMount() {
        await this.fetchTeacherClassData();
        await this.fetchFreeTeachers();
    }

    configureTeacherModal = (data) => {
        console.log(data);
        this.setState({ editingTeacher: data, isModalOpen:true})
    }

    onAddAssociation = () => {
        console.log("click");
        this.setState({isModalOpen:true});
    }

    /* onDeleteAssociation = async (id) => {
        try{
        const response = await api.admin.deleteTeacherAssociation(id);
        if (response.data.success) {
            await this.fetchTeacherClassData();
            toastr.success('Associaiton removed successfully!');
        } else {
            toastr.error(response.data.msg);
        }
        }
        catch(e){
        toastr.error(e);
        }
    } */

    onModalClose = () => {
        this.setState({isModalOpen: false});
    };

    onDeleteModalClose = () => {
        this.setState({deleteModalOpen:false});
    };
    
    onDeleteModalOpen = (id) => {
        this.setState({associationId: id, deleteModalOpen:true});
    };

    render() {
        if(this.state.teachersDat.length || this.state.freeTeachers.length) {
        return (
            <Container className="class-composition contentContainer">
            <h3 className="contentHeader"> 
            <Icon name='id card outline' /> 
            Teacher-Subject-Class Associations</h3>
            <Button color="vk" onClick={this.onAddAssociation}><Icon name='add'/>Create New Associations</Button>
            <Divider horizontal>
                <Header as='h4' color="teal" style={{width: "125px"}}>
                <Icon name='exchange' />
                Associations
                </Header>
            </Divider>
            <Table columns={4} color="teal">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Teacher</Table.HeaderCell>
                    <Table.HeaderCell>Subject</Table.HeaderCell>
                    <Table.HeaderCell>Class</Table.HeaderCell>           
                    <Table.HeaderCell></Table.HeaderCell>           
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {this.state.teachersDat.map((data, index) =>
            <Table.Row key={index}>
                <Table.Cell>{data.FirstName}&nbsp;{data.LastName}</Table.Cell>
                <Table.Cell>{data.Subject}</Table.Cell>
                <Table.Cell>{data.ClassName}</Table.Cell>
                <Table.Cell width={1}>
                    <Tooltip 
                        text="Delete"
                        trigger={
                            <Button icon='cancel' style={{padding:"5px"}}
                            onClick={()=>this.onDeleteModalOpen(data.ID)} /> 
                        }
                    />
                </Table.Cell>
            </Table.Row>
            )} 
            </Table.Body>
            </Table>

            {this.state.isModalOpen &&
              <TeacherClassDetails
                //teacher={this.state.editingTeacher}
                teacherAll={this.state.freeTeachers}
                onClose={this.onModalClose}
                onSave={() => {
                  this.fetchTeacherClassData();
                  this.fetchFreeTeachers();
                  this.onModalClose();
                }}
              />
            }
            {this.state.deleteModalOpen &&
              <TeacherClassDelete
                associationId={this.state.associationId}
                onClose={this.onDeleteModalClose}
                onDeleted={() => {
                    this.fetchTeacherClassData(); 
                    this.onDeleteModalClose();
                }}
              />
            }
            </Container>
        )
        }else{
            return (
                <Container className="class-composition contentContainer">
                <h3 className="contentHeader"> 
                <Icon name='id card outline' /> 
                Teacher-Subject-Class Associations</h3>
                <NoData/>
                </Container>
            )
        }
    }
}

export default TeacherClassAssignment