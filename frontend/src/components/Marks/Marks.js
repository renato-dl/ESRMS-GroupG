import React from 'react';
import { api } from '../../services/api';
import './Marks.scss';
import {Table, Icon, Container, Dropdown } from 'semantic-ui-react';

import moment from 'moment';
import { NoData } from '../NoData/NoData';

export class Marks extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      allMarks: [],
      marks: [],
      studentName: '', 
      subjects: [],
      selectedSubj: ''
    }
  }
    
  async componentDidMount(){
    const student = JSON.parse(localStorage.getItem('selectedChild'));
    const response = await api.parent.getChildMarks(this.props.match.params.studentID);
    if (response) {
      this.setState({ 
        marks: response.data,
        allMarks: response.data,
        studentName: student.FirstName
      })
      let marksSubjects = [];
      let i = 1;
      marksSubjects.push({key:0, value:'all', text:'All'});
      this.state.marks.forEach(function(e){
        let subj = {key: i, value: e.Name, text: e.Name};
        i = i + 1;
        marksSubjects.push(subj);
      });
      this.setState({subjects: marksSubjects});
    }
  }

  selectMarks = async (studentID) => {
    console.log(studentID);
    this.props.history.push('/marks')
  };

  onSelect = (event, {value}) => {
    this.setState({selectedSubj: value});
    if (value != '' && value != 'all'){
      let selectedMarks = [];
      this.state.allMarks.forEach(function(e){
        if(e.Name == value)
          selectedMarks.push(e);
      });
      this.setState({marks: selectedMarks});
    }
    else{
      const allMarks = this.state.allMarks;
      this.setState({marks: allMarks});
    }  
  }
  
  styleMarkColor(mark) {
    if(mark<6){
      return({backgroundColor: "#F8D2D3"});
    }
      return({backgroundColor: "#C6EDBA"});
  };

  marksFormat(num) {
    if (num == 10.25)
      return "10 cum laude";
    else{
      const val = num.toString();
      let res = val.split('.');
      if (res.length > 1){
        if (res[1] == '5')
          return res[0] + '½';
        else if (res[1] == '25')
          return res[0] + '+';
        else if (res[1] == '75'){
          let valInt = parseInt(res[0]);
          return (valInt + 1) + '-';
        }            
      }        
    }
    return num;
  }

  render(){
    // console.log(this.props.match)
    if(this.state.marks.length){
      return (
        <Container className="contentContainer">
              <h3 className="contentHeader"> 
              <Icon name='sort numeric up'/> 
              {this.state.studentName ? this.state.studentName + "'s" : 'Student'} grades            
            </h3>  
            <Dropdown 
              selection
              placeholder='Select subject'
              value={this.state.selectedSubj}
              options={this.state.subjects}
              onChange={this.onSelect}
            />       
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
                  <Table.Cell><span className="markField" style={this.styleMarkColor(mark.Grade)}>{ this.marksFormat(mark.Grade) }</span></Table.Cell>
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
          <Icon name='sort numeric up' /> 
            {this.state.studentName ? this.state.studentName + "'s" : 'Student'} grades
        </h3>
        <NoData/>
      </Container>
    );
  }
}
