import React from 'react';
import { api } from '../../services/api';
import './Marks.scss';
import {Table, Icon, Container} from 'semantic-ui-react';

import moment from 'moment';
import { NoData } from '../NoData/NoData';

export class Marks extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      marks: [],
      studentName: ''
    }
  }
    
  async componentDidMount(){
    const student = JSON.parse(localStorage.getItem('selectedChild'));
    const response = await api.parent.getChildMarks(this.props.match.params.studentID);
    if (response) {
      this.setState({ 
        marks: response.data,
        studentName: student.FirstName
      })
    }
  }

  selectMarks = async (studentID) => {
    console.log(studentID);
    this.props.history.push('/marks')
  };
  
  styleMarkColor(mark) {
    if(mark<6){
      return({backgroundColor: "#F8D2D3"});
    }
      return({backgroundColor: "#C6EDBA"});
  };


  render(){
    console.log(this.props.match)
    if(this.state.marks.length){
      return (
        <Container className="contentContainer">
          <h3 className="contentHeader"> 
            <Icon name='braille'/> 
            {this.state.studentName ? this.state.studentName + "'s" : 'Student'} grades
          </h3>
          <Table class='Marks_table' columns={4}>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>SUBJECT</Table.HeaderCell>
                  <Table.HeaderCell>MARK</Table.HeaderCell>
                  <Table.HeaderCell>TYPE</Table.HeaderCell>
                  <Table.HeaderCell>DATE</Table.HeaderCell>
              </Table.Row>
          </Table.Header>
            <Table.Body>
            {this.state.marks.map((mark) =>
              <Table.Row>
                  <Table.Cell>{ mark.Name } </Table.Cell>
                  <Table.Cell><span className="markField" style={this.styleMarkColor(mark.Grade)}>{ mark.Grade }</span></Table.Cell>
                  <Table.Cell>{ mark.Type } </Table.Cell>
                  <Table.Cell>{ moment(mark.GradeDate).format('LL')}</Table.Cell>
              </Table.Row>
            )} 
            </Table.Body>
            </Table>
            {/* <h3 className="contentHeader"> 
            <Icon name='braille'/> 
             Final Grades
          </h3> */}
          {/* <Table class='Marks_table' columns={3}>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>SUBJECT</Table.HeaderCell>
                  <Table.HeaderCell>FINAL_GRADES</Table.HeaderCell>
                  <Table.HeaderCell>DATE</Table.HeaderCell>
              </Table.Row>
          </Table.Header>
            <Table.Body></Table.Body>
            </Table> */}
        </Container>
      );
    }
    return (
      <Container className="contentContainer">
        <h3 className="contentHeader"> 
          <Icon name='braille' /> 
            {this.state.studentName ? this.state.studentName + "'s" : 'Student'} grades
        </h3>
        <NoData/>
      </Container>
    );
  }
}
