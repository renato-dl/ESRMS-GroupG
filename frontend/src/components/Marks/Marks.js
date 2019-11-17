import React from 'react';
import { api } from '../../services/api';
import './Marks.scss';
import {Table, Icon} from 'semantic-ui-react'

export class Marks extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      marks: []
    }
  }
    
  async componentDidMount(){
    const response = await api.parent.getChildMarks('9d64fa59c91d9109b11cd9e05162c675', this.props.match.params.studentID);
    if (response) {
      this.setState({ marks: response.data })
    }
  }

  selectMarks = async (studentID) => {
    console.log(studentID);
    this.props.history.push('/marks')
  };

  render() {
    return (
      <div className="Marks-container">
        <div className="contentContainer">
          <h3 className="contentHeader">
            <Icon name='sort numeric up' />
            Grades of Student {this.props.match.params.studentID} Surname 2019-2020
          </h3>
          {/* <h2 className="title">Student {this.props.match.params.studentID}'s score:</h2> */}
          <Table celled>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>Subject</Table.HeaderCell>
                  <Table.HeaderCell>Marks</Table.HeaderCell>
                  <Table.HeaderCell>Time</Table.HeaderCell>
              </Table.Row>
          </Table.Header>
           <Table.Body>
           {this.state.marks.map((mark) =>
              <Table.Row>
                  <Table.Cell>{ mark.Name } </Table.Cell>
                  <Table.Cell>{ mark.Grade }</Table.Cell>
                  <Table.Cell>{ mark.GradeDate }</Table.Cell>

              </Table.Row>
           )}
           </Table.Body>
           </Table>
        </div>
      </div>
    )
  }
}
