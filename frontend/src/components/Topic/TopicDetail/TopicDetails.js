import React from 'react'
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TopicDetail.scss";
import {api} from '../../../services/api';
import { withRouter } from "react-router";
import * as toastr from 'toastr';

class TopicDetails extends React.Component {
  state = {
    topicID: null,
    title: '',
    description: '',
    date: new Date(),
    class: '1',
    isSaving: false
  };

  componentDidMount() {
    const {topic} = this.props;

    if (topic) {
      this.setState({
        topicID: topic.ID,
        title: topic.Title,
        description: topic.TopicDescription,
        date: new Date(topic.TopicDate)
      });
    }
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({[name]: value});
  };

  handleDateChange = (date) => {
    this.setState({date});
  };

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    const {params} = this.props.match;
    try {
      const topicData = {
        topicId: this.state.topicID,
        classId: this.state.class,
        subjectId: params.subjectID,
        topicTitle: this.state.title,
        topicDescription: this.state.description,
        topicDate: this.state.date.toUTCString()
      };

      this.state.topicID ?
        await api.teacher.updateTopic(
          params.teacherID,
          topicData
        ) :
        await api.teacher.saveTopic(
          params.teacherID,
          topicData
        );

      toastr.success(`Topic ${this.state.topicID ? 'updated' : 'added'} successfully.`);
    } catch (e) {
      this.setState({isSaving: false});
      return toastr.error(e);
    }

    this.setState({isSaving: false});
    this.props.onSave();
  };

  onClose = () => {
    if (this.state.isSaving) {
      return;
    }

    this.props.onClose();
  };

  render() {
    return (
      <Modal dimmer open className="topic-detail" size="small">
        <Modal.Header>
          <span>{this.state.topicID ? 'Edit topic' : 'Insert a topic'}</span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>
          <Form loading={this.state.isSaving}>
            <Form.Input
              name="title"
              label='Topic title'
              placeholder='Topic title'
              value={this.state.title}
              onChange={this.handleInputChange}
            />
            <Form.TextArea
              rows={3}
              name="description"
              label='Topic description'
              placeholder='Topic description'
              value={this.state.description}
              onChange={this.handleInputChange}
            />
            <Form.Group widths='equal'>
              <Form.Select
                name="class"
                label="Class"
                options={[
                  { key: '1', text: 'Class 1', value: '1' },
                  { key: '2', text: 'Class 2', value: '2' },
                  { key: '3', text: 'Class 3', value: '3' },
                ]}
                placeholder="Class"
                value={this.state.class}
                onChange={this.handleInputChange}
              />
              <Form.Field>
                <LabelDetail>Topic date</LabelDetail>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.handleDateChange}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.onSave} disabled={!this.state.title || !this.state.description || !this.state.date}>
            <Icon name='checkmark' /> Save
          </Button>

        </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(TopicDetails);
