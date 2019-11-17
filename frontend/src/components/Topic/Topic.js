import React from 'react';
import { api } from '../../services/api';
import './Topic.scss';
import {
  Table,
  Button, Icon
} from 'semantic-ui-react'
import moment from 'moment';
import TopicDetails from './TopicDetail/TopicDetails';

export class Topic extends React.Component{
    constructor(props) {
      super(props);

      this.state = {
        topics: [],
        isTopicDetailsOpen: false
      }
    }
    
    async componentDidMount() {
      await this.fetchTopics();
    }

    fetchTopics =  async () => {
      const {params} = this.props.match;

      const response = await api.teacher.getTeacherTopics(params.teacherID, '1', params.subjectID);
      if (response) {
        this.setState({ topics: response.data })
      }
    };

    addTopic = () => {
      this.setState({isTopicDetailsOpen: true});
    };

    onTopicDetailClose = () => {
      this.setState({isTopicDetailsOpen: false});
    };

    render(){
      return (
        <div className="Topic-container">
          <h2 className="title">Teacher {this.props.match.params.teacherID}'s topics:</h2>
          <Button content='Add topic' primary onClick={this.addTopic} />
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="left">Title</Table.HeaderCell>
                <Table.HeaderCell textAlign="left">Title</Table.HeaderCell>
                <Table.HeaderCell textAlign="left">Description</Table.HeaderCell>
                <Table.HeaderCell textAlign="left">Date</Table.HeaderCell>
                <Table.HeaderCell textAlign="left">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.topics.map((topic, index) =>
                <Table.Row key={index}>
                  <Table.Cell textAlign="left" width={1}>{ index + 1 }</Table.Cell>
                  <Table.Cell textAlign="left">{ topic.Title }</Table.Cell>
                  <Table.Cell textAlign="left">{ topic.TopicDescription }</Table.Cell>
                  <Table.Cell textAlign="left" width={2}>{ moment(topic.TopicDate).format('LL') }</Table.Cell>
                  <Table.Cell textAlign="left" className="edit-cell" onClick={() => this.editTopic(topic)}>
                    <Icon name="edit"/> Edit
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          {this.state.isTopicDetailsOpen &&
            <TopicDetails
              onClose={this.onTopicDetailClose}
              onSave={() => {
                this.fetchTopics();
                this.onTopicDetailClose();
              }}
            />
          }
        </div>
      )
    }
}
