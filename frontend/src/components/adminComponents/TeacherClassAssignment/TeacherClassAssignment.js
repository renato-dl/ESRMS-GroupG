import React, { Component } from 'react';
import { api } from '../../../services/api';
import {Icon, Container, Table, Divider, Header, List, Image, Button, Segment} from 'semantic-ui-react';

import IsTeacher from '../../../assets/images/iconTeacher.jpg';

import { NoData } from '../../NoData/NoData';
import TeacherClassDetails from './TeacherClassDetails/TeacherClassDetails';

export class TeacherClassAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen:false,
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
        const response = await api.admin.getTeachersWithNoClassSubject(); // still something wrong here.. Giulia tesori has class subject but still appears in free 
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

    onModalClose= () => {
        this.setState({isModalOpen: false});
    };

    render() {
        if(this.state.teachersDat.length || this.state.freeTeachers.length) {
        return (
            <Container className="class-composition contentContainer">
            <h3 className="contentHeader"> 
            <Icon name='id card outline' /> 
            Teacher-Subject-Class Associations</h3>

            { this.state.freeTeachers.length !==0 && <>
                <Divider horizontal>
                    <Header as='h4'color="red" style={{width: "140px"}}>
                    <Icon name='settings' />
                    New Teachers
                    </Header>
                </Divider>

                <div style = {{width:"100%", maxHeight:"200px", overflowY:"scroll"}}>
                    <Segment compact style = {{margin:"auto"}}>
                    <List selection divided verticalAlign='middle' size="large" >
                    
                    {this.state.freeTeachers.map((data, index) =>
                        <List.Item key={index} onClick={()=>this.configureTeacherModal(data)}>
                        <Image avatar src={IsTeacher} />
                        <List.Content>
                            <List.Header style={{color:"#41648A"}}>{data.FirstName}&nbsp;{data.LastName}</List.Header>
                        </List.Content>
                        </List.Item>
                    )}
                    
                    </List>
                    </Segment>
                </div>
            </>}

            <Divider horizontal>
                <Header as='h4' color="teal" style={{width: "192px"}}>
                <Icon name='exchange' />
                Current Associations
                </Header>
            </Divider>
            <Table columns={3} color="teal">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Teacher</Table.HeaderCell>
                    <Table.HeaderCell>Subject</Table.HeaderCell>
                    <Table.HeaderCell>Class</Table.HeaderCell>           
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {this.state.teachersDat.map((data, index) =>
            <Table.Row key={index}>
                <Table.Cell>{data.FirstName}&nbsp;{data.LastName}</Table.Cell>
                <Table.Cell>{data.Subject}</Table.Cell>
                <Table.Cell>{data.ClassName}</Table.Cell>
            </Table.Row>
            )} 
            </Table.Body>
            </Table>

            {this.state.isModalOpen &&
              <TeacherClassDetails
                teacher={this.state.editingTeacher}
                onClose={this.onModalClose}
                onSave={() => {
                  this.fetchTeacherClassData();
                  this.fetchFreeTeachers();
                  this.onModalClose();
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