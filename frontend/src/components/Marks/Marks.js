import React from 'react';
import { api } from '../../services/api';
import './Marks.scss';
import {Table, Icon} from 'semantic-ui-react';

import moment from 'moment';
import { NoData } from '../NoData/NoData';

export class Marks extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      marks: []
    }
  }
    
  async componentDidMount(){
    console.log(this.props.params);
    const response = await api.parent.getChildMarks('9d64fa59c91d9109b11cd9e05162c675', this.props.match.params.studentID);
    console.log(response);
    if (response) {
      this.setState({ marks: response.data })
    }
  }

  selectMarks = async (studentID) => {
    console.log(studentID);
    this.props.history.push('/marks')
  };

  render(){
    console.log(this.props.match)
    if(this.state.marks.length){
      return (
        <div className="contentContainer">
          <h3 className="contentHeader"> 
            <Icon name='braille'/> 
            Grades of Student:&nbsp;&nbsp;&nbsp;&nbsp; {this.props.match.params.studentID} 
          </h3>
          {/* <h2 className="title">Student {this.props.match.params.studentID}'s score:</h2> */}
          <Table celled>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>SUBJECT</Table.HeaderCell>
                  <Table.HeaderCell>DATE</Table.HeaderCell>
                  <Table.HeaderCell>MARK</Table.HeaderCell>
              </Table.Row>
          </Table.Header>
            <Table.Body>
            {this.state.marks.map((mark) =>
              <Table.Row>
                  <Table.Cell>{ mark.Name } </Table.Cell>
                  <Table.Cell>{ moment(mark.GradeDate).format('LL')}</Table.Cell>
                  <Table.Cell>{ mark.Grade }</Table.Cell>
              </Table.Row>
            )} 
            </Table.Body>
            </Table>
        </div>
      );
    }
    return (
      <div className="contentContainer">
        <h3 className="contentHeader"> 
          <Icon name='braille' /> 
          Grades of Student:&nbsp;&nbsp;&nbsp;&nbsp; {this.props.match.params.studentID} 
        </h3>
        <NoData/>
      </div>
    );
  }
}
