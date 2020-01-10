import React, { Component } from 'react'
import { api } from '../../services/api';

import '../ParentMaterials/ParentMaterial.scss';

import { NoData } from '../NoData/NoData';
import {Icon, Container, Grid, Menu, Segment, List, Button, Divider} from 'semantic-ui-react';
import AddMaterial from './TeacherMaterialDetails/AddMaterial';

export class TeacherMaterial extends Component {
    state={
        subjects:[],
        allMaterialList:[],
        activeItem: null,

        AddModalOpen:false,
        EditModalOpen:false,
        DeleteModalOpen:false
    }

    handleItemClick = (e, { value }) => this.setState({ activeItem: value })
  

    fetchSubjects = async () => {
        const response = await api.teacher.getTeacherSubjects(); //probably incorrect... clear out if subjects will be uniques or several for diff classes
        if(response) {
            this.setState( {subjects: response.data, activeItem: response.data[0].subjectId});
        }
    } 

    async componentDidMount() {
        await this.fetchSubjects();
    }

    AddMaterial = () => {
        this.setState({AddModalOpen:true});
    }
    AddMaterialClose = () => {
        this.setState({AddModalOpen:false});
    }

    DeleteMaterialClose = () => {
        this.setState({DeleteModalOpen:false});
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
                                <List.Item>
                                    
                                    <List.Content floated='right'>
                                    <Button.Group>
                                        <Button icon="edit"></Button>
                                        <Button.Or className = "custOrButton" text=''/>
                                        <Button icon="delete"></Button>
                                    </Button.Group>
                                    </List.Content>

                                    <List.Icon name='file' size='large' verticalAlign='middle' />
                                    <List.Content>
                                    <List.Header className = "fileNameHeader">Example File Name</List.Header>
                                    <List.Description>Jan 12, 2020</List.Description>
                                    </List.Content>
                                </List.Item>
                                </List>


                            </Segment>
                        </Grid.Column>
                        </Grid>

                        {this.state.AddModalOpen && 
                            <AddMaterial
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
