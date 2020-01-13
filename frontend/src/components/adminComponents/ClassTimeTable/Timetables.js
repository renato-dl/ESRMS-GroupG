import React, { Component } from 'react'
import { Button, Card, Container, Icon, Image } from 'semantic-ui-react'
import { NoData } from '../../NoData/NoData';
import { api } from '../../../services/api';
import {TimetableAdd} from './TimetableAdd';
import ClockIcon from '../../../assets/images/clock.png';

export class Timetables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [], 
      classData: null, 
      timetableModalOpen: false,
      classesTimetables: null,
    }
  }

  async componentDidMount(){
    this.fetchClasses();
    this.fetchTimetables();
  }

  async fetchClasses(){
    try{
      const response = await api.admin.getClasslist();
      if (response && response.data) {
        //console.log(response)
        this.setState({classes: response.data})
      } 
    }
    catch(ex){
      console.log(ex);
    }    
  }

  async fetchTimetables(){
    try{
      const response = await api.admin.getAllTimetables();
      if(response && response.data && response.data.timetables){
        // console.log(response.data);
        const timetablesDict = {};
        response.data.timetables.forEach(function(elem){
          timetablesDict[elem.ClassID] = elem.Timetable;
        });
        // console.log(timetablesDict);
        this.setState({ classesTimetables: timetablesDict });
      }      
    }
    catch(err){
      console.log(err);
    }
  }

  showTimetable = (data) => {
    this.setState({ classData: data, timetableModalOpen: true });
  }

  onModalClose = async () => {
    await this.fetchTimetables();
    this.setState({classData: null, timetableModalOpen: false});
  };

  getTimetable(classD){
    const timetables = this.state.classesTimetables;
    const classId = classD.ID;
    const timetable = timetables[classId];
    return timetable;
  }

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
            <Card style = {{border: "1px solid #41648A"}} key={index}>
            <Card.Content>
              <Image
                floated='right'
                size='mini'
                src={ClockIcon}
              />
              <Card.Header>
                <h1 style ={{color: '#536574'}}> Class {data.Name} </h1>
              </Card.Header>
              {/* <Card.Meta>Created on {data.CreationYear}</Card.Meta> */}
              <Card.Description>
                <span style ={{fontSize: '16px'}}>Teacher Coordinator <strong>{data.Coordinator}</strong></span>
              </Card.Description>
            </Card.Content>
            <Card.Content extra textAlign='center'>
                <Button fluid color='blue' onClick={() =>this.showTimetable(data)}>
                  Timetable
                </Button>
            </Card.Content>
          </Card>
          )}
      </Card.Group>
      {this.state.timetableModalOpen &&
        <TimetableAdd
          timetable={this.getTimetable(this.state.classData)}
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
