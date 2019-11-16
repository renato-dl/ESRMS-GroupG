import React from 'react';
import { api } from '../../services/api';
import './Topic.scss';
import {Table} from 'semantic-ui-react'


export class Topic extends React.Component{
    constructor(props) {
      super(props);

      this.state = {
        topics: []
      }
    }
    
    async componentDidMount(){
      const response = await api.teacher.getTeacherTopics(this.props.match.params.teacherID, '1','1');
      console.log(response);
      if (response) {
        this.setState({ topics: response.data })
      }
    }

    // selectTopics = async (teacherId) => {
    //   this.props.history.push('/topic')
    // }

    render(){
      return (
        <div className="Topic-container">
          <h2 className="title">Teacher {this.props.match.params.teacherID}'s topics:</h2>
          <Table celled>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
              </Table.Row>
          </Table.Header>
           <Table.Body>
          {this.state.topics.map((topic) =>
              <Table.Row>
                  <Table.Cell>{ topic.Title } </Table.Cell>
                  <Table.Cell>{ topic.TopicDescription }</Table.Cell>
                  <Table.Cell>{ topic.TopicDate }</Table.Cell>
              </Table.Row>
           )} 
           </Table.Body>
           </Table>
        </div>
      )
    }
}
