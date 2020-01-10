import React, { Component } from 'react'
import { api } from '../../services/api';

import './ParentMaterial.scss';

import { NoData } from '../NoData/NoData';
import {Icon, Container, Grid, Menu, Segment, List, Button} from 'semantic-ui-react';

export class ParentMaterials extends Component {
    state={
        subjects:[],
        allMaterialList:[],
        activeItem: null
    }

    handleItemClick = (e, { value }) => this.setState({ activeItem: value })
  

    fetchSubjects = async () => {
        const response = await api.parent.getSubjectslist();
        if(response) {
            this.setState( {subjects: response.data, activeItem: response.data[0].ID});
        }
    }
    fetchMaterials = async () => {
        const child = JSON.parse(localStorage.getItem('selectedChild'));
        const response = await api.parent.getSupportMaterials(child.ID);
        if(Response) {
            this.setState({allMaterialList: response.data});
        }
    }

    async componentDidMount() {
        await this.fetchSubjects();
        await this.fetchMaterials();
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

                                <List divided relaxed verticalAlign='middle'>
                                <List.Item>
                                    
                                    <List.Content floated='right'>
                                        <Button icon="download"></Button>
                                    </List.Content>

                                    <List.Icon name='file' size='large' verticalAlign='middle' />
                                    <List.Content>
                                    <List.Header className = "fileNameHeader">Example File Name</List.Header>
                                    {/* <List.Description as='a'>Updated 10 mins ago</List.Description> */}
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    
                                    <List.Content floated='right'>
                                        <Button icon="download"></Button>
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

export default ParentMaterials
