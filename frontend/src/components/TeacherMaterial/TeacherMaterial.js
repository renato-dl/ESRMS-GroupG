import React, { Component } from 'react'
import { api } from '../../services/api';

import '../ParentMaterials/ParentMaterial.scss';

import { NoData } from '../NoData/NoData';
import {Icon, Container, Grid, Menu, Segment, List, Button, Divider} from 'semantic-ui-react';

export class TeacherMaterial extends Component {
    state={
        subjects:[],
        allMaterialList:[],
        activeItem: null
    }

    handleItemClick = (e, { value }) => this.setState({ activeItem: value })
  

    fetchSubjects = async () => {
        const response = await api.teacher.getSubjectslist();
        if(response) {
            this.setState( {subjects: response.data, activeItem: response.data[0].ID});
        }
    } 

    async componentDidMount() {
        await this.fetchSubjects();
    }

    render() {
        const { activeItem } = this.state

        if(this.state.subjects.length){ 
            return (
                <Container className="contentContainer">
                    <h3 className="contentHeader"> 
                        <Icon name='cloud download'/> 
                        Subject Materials
                    </h3>


                    <Grid>
                        <Grid.Column width={6}>
                            <Menu fluid vertical tabular>
                                
                            { this.state.subjects.map((data, index) =>
                            <Menu.Item
                                name={data.Name}
                                value={data.ID}
                                active={activeItem === data.ID}
                                onClick={this.handleItemClick}
                            />
                            )}
                            </Menu>
                        </Grid.Column>

                        <Grid.Column stretched width={10}>
                            <Segment>
                                {/* <NoData/> */}
                                <Button color="vk" fluid><Icon name='upload' /> Upload New File</Button>
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


                </Container>
            )
        }
        return (
            <Container className="contentContainer">
              <h3 className="contentHeader">      
                <Icon name='cloud download'/> 
                Subject Materials
              </h3>
              <NoData/>
            </Container>
        );
    }
}

export default TeacherMaterial
