import React, { Component } from 'react'
import { api } from '../../services/api';

import '../ParentMaterials/ParentMaterial.scss';

import { NoData } from '../NoData/NoData';
import {Icon, Container, Grid, Menu, Segment, List, Button, Divider} from 'semantic-ui-react';
import AddMaterial from './TeacherMaterialDetails/AddMaterial';

import moment from 'moment';
import toastr from 'toastr';

export class TeacherMaterial extends Component {
    state={
        subjects:[],
        allMaterialList:[],
        activeItem: null,
        selectedSubject: null,

        AddModalOpen:false,

        MAX_ALLOWED_FILES: 10
    }

    handleItemClick = async (e, { value }) => {
        this.setState({ activeItem: value });
        const subjects = this.state.subjects;
        let subject = '';
        subjects.forEach(function(elem){
            if(elem.subjectId == value){
                subject = elem;
            }                
        })
        this.setState({selectedSubject: subject});
        try {
            const response = await api.teacher.getMaterialBySubject(subject.subject);
            if(response && response.data){
                this.setState({allMaterialList: response.data.supportMaterial });
            }
        } catch (error) {
            console.log(error);
        }        
    }

    fetchSubjects = async () => {
        try {
            const response = await api.teacher.getTeacherSubjects();
            if(response && response.data) {
                this.setState( {subjects: response.data, activeItem: response.data[0].subjectId});
                this.setState({selectedSubject: response.data[0]});
                await this.fetchMaterials(response.data[0].subject);
            }
        } catch (error) {
            console.log(error);
        }        
    } 

    fetchMaterials = async (subject) => {
        try {
            const materials = await api.teacher.getMaterialBySubject(subject);
            if(materials && materials.data){
                this.setState({allMaterialList: materials.data.supportMaterial });
            }
        } catch (error) {
            console.log(error);
        }        
    }

    async componentDidMount() {
        await this.fetchSubjects();
    }

    AddMaterial = () => {
        this.setState({AddModalOpen:true});
    }
    AddMaterialClose = async () => {
        await this.fetchMaterials(this.state.selectedSubject.subject);
        this.setState({AddModalOpen:false});
    }

    async deleteMaterial(obj){
        const request = {ID: obj.ID};
        try {
            const response = await api.teacher.deleteMaterialById(request);
            if(response && response.data && response.data.success){
                toastr.success(`${obj.Name} deleted!`);
            }
        } catch (error) {
            console.log(error);
            toastr.error(error);
        }
        await this.fetchMaterials(obj.Subject);
    }

    render() {
        const { activeItem } = this.state

        if(this.state.subjects.length){ 
            return (
                <Container className="contentContainer">
                    <h3 className="contentHeader"> 
                        <Icon name='cloud upload'/> 
                        Subject Materials
                    </h3>


                    <Grid>
                        <Grid.Column width={6}>
                            <Menu fluid vertical tabular>
                                
                            { this.state.subjects.map((data, index) =>
                            <Menu.Item
                                key={index}
                                name={data.subject}
                                value={data.subjectId}
                                active={activeItem === data.subjectId}
                                onClick={this.handleItemClick}
                            />
                            )}
                            </Menu>
                        </Grid.Column>

                        <Grid.Column stretched width={10}>
                            <Segment>
                                {/* <NoData/> */}
                                <Button color="vk" fluid onClick={this.AddMaterial}>
                                    <Icon name='upload' /> 
                                    Upload New File
                                </Button>
                                <Divider/>
                                <List divided relaxed verticalAlign='middle'>
                                    {this.state.allMaterialList.map((elem, index) => 
                                        <List.Item key={index}>
                                    
                                        <List.Content floated='right'>
                                        <Button.Group>
                                            {/* <Button icon="edit"></Button> */}
                                            <Button.Or className = "custOrButton" text=''/>
                                            <Button icon="delete"onClick={() => this .deleteMaterial(elem)}></Button>
                                        </Button.Group>
                                        </List.Content>
    
                                        <List.Icon name='file' size='large' verticalAlign='middle' />
                                        <List.Content>
                                        <List.Header className = "fileNameHeader">{elem.Name}</List.Header>
                                        <List.Description>{moment(elem.CreatedOn).format('MMM D, YYYY')}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    )}
                                </List>
                            </Segment>
                        </Grid.Column>
                        </Grid>

                        {this.state.AddModalOpen && 
                            <AddMaterial
                                subjectId={this.state.activeItem}
                                maxFiles={this.state.MAX_ALLOWED_FILES}
                                onClose={this.AddMaterialClose}
                            />
                        }
                </Container>
            )
        }
        return (
            <Container className="contentContainer">
              <h3 className="contentHeader">      
                <Icon name='cloud upload'/> 
                Subject Materials
              </h3>
              <NoData/>
            </Container>
        );
    }
}

export default TeacherMaterial