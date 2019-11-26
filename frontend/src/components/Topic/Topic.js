import React from 'react';
import { api } from '../../services/api';
import './Topic.scss';
import {
  Table,
  Button,
  Icon,
  Container
} from 'semantic-ui-react'
import moment from 'moment';
import TopicDetails from './TopicDetail/TopicDetails';
import { NoData } from '../NoData/NoData';

export class Topic extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        subject: null,
        topics: [],
        editingTopic: null,
        isTopicDetailsOpen: false
      }
    }
    
    async componentDidMount() {
      await this.fetchTopics();
      await this.fetchSubject();
    }

    fetchTopics =  async () => {
      const {params} = this.props.match;
      
      //ATTENTION CLASS ID IS HARDCODED
      const response = await api.teacher.getTeacherTopics( 1, params.subjectID);
      if (response) {
        this.setState({ topics: response.data, editingTopic: null })
      } 
    }; 

    fetchSubject = async () => {
      const {params} = this.props.match;

      const response = await api.teacher.getTeacherSubjects(params.teacherID);
      if (response) {
        response.data.forEach((subject) => {
          if (subject.subjectId == params.subjectID) {
            this.setState({subject});
          }
        });
      }
    };

    addTopic = () => {
      this.setState({isTopicDetailsOpen: true});
    };

    onTopicDetailClose = () => {
      this.setState({editingTopic: null, isTopicDetailsOpen: false});
    };

    editTopic = (topic) => {
      this.setState({editingTopic: topic, isTopicDetailsOpen: true});
    };

    render(){
      if (this.state.topics.length){

      return (
        <Container className="Topic-container contentContainer">
          <h3 className="contentHeader">
            <Icon name='braille' size="small" />
            {this.state.subject ? this.state.subject.subject : ''} topics
          </h3>
          <Button className="ui vk button" onClick={this.addTopic}>
            <Icon name="plus" />
            Add topic
          </Button>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="left">#</Table.HeaderCell>
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
                  <Table.Cell textAlign="left" className="edit-cell" onClick={() => this.editTopic(topic)} width={1}>
                    <Icon name="edit"/> Edit
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          {this.state.isTopicDetailsOpen &&
            <TopicDetails
              topic={this.state.editingTopic}
              onClose={this.onTopicDetailClose}
              onSave={() => {
                this.fetchTopics();
                this.onTopicDetailClose();
              }}
            />
          }
        </Container>
      );

      }

      return(
        <div className="Topic-container contentContainer">
          <h3 className="contentHeader">
            <Icon name='braille' size="small" />
            {this.state.subject ? this.state.subject.subject : ''} topics
          </h3>
          <Button className="ui vk button" onClick={this.addTopic}>
            <Icon name="plus" />
            Add topic
          </Button>


          <NoData/>
          {this.state.isTopicDetailsOpen &&
            <TopicDetails
              topic={this.state.editingTopic}
              onClose={this.onTopicDetailClose}
              onSave={() => {
                this.fetchTopics();
                this.onTopicDetailClose();
              }}
            />
          }
        </div>
      );
    }
}
