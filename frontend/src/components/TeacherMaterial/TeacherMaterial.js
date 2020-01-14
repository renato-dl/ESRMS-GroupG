import React, { Component } from 'react'
import { api } from '../../services/api';

import '../ParentMaterials/ParentMaterial.scss';

import Tooltip from '../Tooltip/Tooltip';
import { NoData } from '../NoData/NoData';
import fileDownload from 'js-file-download/file-download';
import {Icon, Container, Grid, Menu, Segment, List, Button, Divider} from 'semantic-ui-react';
import AddMaterial from './TeacherMaterialDetails/AddMaterial';

import moment from 'moment';
import TeacherDeleteMaterialConfirmation from './TeacherMaterialDetails/TeacherDeleteMaterialConfirmation';

export class TeacherMaterial extends Component {
    state={
        subjects:[],
        allMaterialList:[],
        activeItem: null,
        selectedSubject: null,

        AddModalOpen:false,
        deleteModalOpen:false,
        fileToDelete:[],

        MAX_ALLOWED_FILES: 10
    }

    handleItemClick = async (e, { value }) => {
        this.setState({ activeItem: value });
        const subjects = this.state.subjects;
        let subject = '';
        subjects.forEach(function(elem){
            if(elem.subjectId == value.split(",")[0] && elem.classId == value.split(",")[1]){
                subject = elem;
            }                
        })
        this.setState({selectedSubject: subject});
        try {
            const response = await api.teacher.getMaterialBySubject(subject.subject);
            if(response && response.data){
                this.setState({allMaterialList: response.data.supportMaterial });
                console.log(response.data.supportMaterial);
            }
        } catch (error) {
            console.log(error);
        }        
    }

    /* removeDuplications(subjectList){
        let uniques = {};
        let uniqueSubjects = [];
        subjectList.forEach(function(elem){
            if(!uniques[elem.subjectId]){
                uniqueSubjects.push(elem);
                uniques[elem.subjectId] = true;
            }                
        });
        return uniqueSubjects;
    } */

    fetchSubjects = async () => {
        try {
            const response = await api.teacher.getTeacherSubjects();
            if(response && response.data) {
                //const subjectList = this.removeDuplications(response.data);
                const subjectList = response.data;
                this.setState( {subjects: subjectList, activeItem: response.data[0].subjectId + ',' + response.data[0].classId});
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

    onDeleteModalClose = () => {
        this.setState({deleteModalOpen:false});
    };
    
    onDeleteModalOpen = (file) => {
        this.setState({fileToDelete: file, deleteModalOpen:true});
    };

    handleDownload =  async (fileName) => {
        const response = await api.teacher.getMaterialFile(fileName);
        fileDownload(response.data, fileName);
    };

    /* async deleteMaterial(obj){
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
 */
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
                                name={data.subject + " " + data.class}
                                value={data.subjectId + ',' + data.classId}
                                active={activeItem === data.subjectId + ',' + data.classId}
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
                                        <Button.Group size="mini">
                                            {/* <Button icon="download"></Button>
                                            <Button.Or className = "custOrButton" text=''/>
                                            <Button icon="delete"onClick={() => this .onDeleteModalOpen(elem)}></Button> */}
                                            <Tooltip 
                                                text="Download"
                                                trigger={
                                                    <Button icon="download" color="vk" onClick={() => {this.handleDownload(elem.Key)}}></Button> 
                                                }
                                            />
                                            <Button.Or className = "custOrButton" text=''/>
                                            <Tooltip 
                                                text="Delete"
                                                trigger={
                                                    <Button icon="delete" color="google plus" onClick={() => this .onDeleteModalOpen(elem)}></Button>
                                                }
                                            />
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
                                subject={this.state.selectedSubject}
                                maxFiles={this.state.MAX_ALLOWED_FILES}
                                onClose={this.AddMaterialClose}
                            />
                        }
                        {this.state.deleteModalOpen &&
                            <TeacherDeleteMaterialConfirmation
                                file={this.state.fileToDelete}
                                onClose={this.onDeleteModalClose}
                                onDeleted={() => {
                                    this.fetchMaterials(this.state.fileToDelete.Subject); 
                                    this.onDeleteModalClose();
                                }}
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
