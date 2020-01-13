import React, { Component } from 'react'
import { api } from '../../services/api';
import './ParentMaterial.scss';
import moment from 'moment';
import fileDownload from 'js-file-download/file-download';
import { NoData } from '../NoData/NoData';
import {Icon, Container, Grid, Menu, Segment, List, Button} from 'semantic-ui-react';

export class ParentMaterials extends Component {
    state={
        subjects:[],
        allMaterialList:[],
        materialListBySubject:[],
        activeItem: null
    }

    handleDownload =  async (fileName) => {
        console.log(fileName);
        const response = await api.parent.getSupportMaterialFile(fileName);
        fileDownload(response.data, fileName);
    };

    handleItemClick = (e, { value }) => {
        e.preventDefault();
        this.setState({ activeItem: value })
        this.filterMaterials(value);
    }    

    filterMaterials = (id) => {
        let materials = [];
        this.state.allMaterialList.forEach(function(e){
            if(e.SubjectID == id)
            materials.push(e);
        });
        this.setState({materialListBySubject: materials});
    }

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
        this.filterMaterials(this.state.activeItem);
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
                                key={index}
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
                                {this.state.materialListBySubject.length === 0 &&
                                <NoData/>
                                }
                                {this.state.materialListBySubject.length !==0  &&
                                <List divided relaxed verticalAlign='middle'>
                                    {this.state.materialListBySubject.map((elem, index) => 
                                        <List.Item key={index}>
                                    
                                        <List.Content floated='right'>
                                            <Button icon="download" onClick={() => {this.handleDownload(elem.Key)}}></Button>
                                        </List.Content>
    
                                        <List.Icon name='file' size='large' verticalAlign='middle' />
                                        <List.Content>
                                        <List.Header className = "fileNameHeader">{elem.Name}</List.Header>
                                        <List.Description>{moment(elem.CreatedOn).format('MMM D, YYYY')}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    )}
                                </List>
                                }

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
