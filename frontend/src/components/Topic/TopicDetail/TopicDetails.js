import React from 'react'
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'
import "react-datepicker/dist/react-datepicker.css";
import "./TopicDetail.scss";
import {api} from '../../../services/api';
import { withRouter } from "react-router";
import * as toastr from 'toastr';

import moment from 'moment';
import DatePicker , { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
registerLocale("en", en);

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

      if(!this.state.topicID) {
        await api.teacher.saveTopic(topicData);
        toastr.success(`Topic ${this.state.topicID ? 'updated' : 'added'} successfully.`);
      } else {
        const reqResult = await api.teacher.updateTopic(topicData);  
        
        if (reqResult.data.Success) {
          toastr.success('Topic updated successfully.');
        } else {
          toastr.error(reqResult.data.Message);
          this.setState({isSaving: false});
          return;
        }
      }
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

  isWeekday = date => {
    const day = moment(date).day();
    return day !== 0;
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
              <Form.Field>
                <LabelDetail>Topic date</LabelDetail>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.handleDateChange}
                  maxDate={new Date()}
                  locale="en"
                  filterDate={this.isWeekday}
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
