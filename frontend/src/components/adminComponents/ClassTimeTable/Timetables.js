import React, { Component } from 'react'
import { Button, Card, Image, Container, Icon } from 'semantic-ui-react'
import { NoData } from '../../NoData/NoData';
import { api } from '../../../services/api';
import {TimetableAdd} from './TimetableAdd';

export class Timetables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [], 
      classData: null, 
      timetableModalOpen: false
    }
  }

  async componentDidMount(){
    this.fetchClasses();
  }

  async fetchClasses(){
    const response = await api.admin.getClasslist();
    if (response) {
      //console.log(response)
      this.setState({classes: response.data})
    } 
  }

  showTimetable = (data) => {
    this.setState({ classData: data, timetableModalOpen: true });
  }

  onModalClose = () => {
    this.setState({classData: null, timetableModalOpen: false});
  };

  render() {
    if(this.state.classes.length) {
    return (
      <Container className="class-composition contentContainer">
        <h3 className="contentHeader"> 
          <Icon name='braille'/> 
          Class Timetables
        </h3>
        <Card.Group>
          {this.state.classes.map((data, index) =>
            <Card key={index}>
            <Card.Content>
              <Card.Header>Class {data.Name}</Card.Header>
              <Card.Meta>Created on {data.CreationYear}</Card.Meta>
              <Card.Description>
                Teacher Coordinator <strong>{data.Coordinator}</strong>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button basic color='green' onClick={() =>this.showTimetable(data)}>
                  Timetable
                </Button>
            </Card.Content>
          </Card>
          )}
      </Card.Group>
      {this.state.timetableModalOpen &&
        <TimetableAdd
          class={this.state.classData}
          onClose={this.onModalClose}
        />
      }
      </Container>
      
    )}
    else{
      return (
        <Container className="contentContainer">
          <h3 className="contentHeader"> 
            <Icon name='braille' /> 
            Class Timetables</h3>
          <NoData/>
        </Container>
      )
    }
  }
}

export default Timetables
