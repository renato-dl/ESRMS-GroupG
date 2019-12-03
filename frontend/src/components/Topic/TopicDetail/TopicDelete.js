import React, { Component } from 'react';
import {Button, Modal, Icon} from 'semantic-ui-react'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import "./TopicDetail.scss";
import {api} from '../../../services/api';
import * as toastr from 'toastr';

export class TopicDelete extends Component {
  state = {
    topicId: null,
    title: null,
    description: null,
    date: null,
    isSaving: false
  };

  componentDidMount() {
    const dTopic = this.props.topic;

    if (dTopic) {
      try{
        this.setState({
          topicId: dTopic.ID,
          title: dTopic.Title,
          description: dTopic.TopicDescription,
          date: dTopic.TopicDate,
        });
      }
      catch(e){

      }
    }
  };

  onSave = async () => {
    if (this.state.isSaving) {
      return;
    }

    this.setState({isSaving: true});

    try {
      const request = {
        ID: this.state.topicId
      }

      await api.teacher.deleteTopic(request);
      toastr.success(`Topic deleted successfully.`);           
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
          <span>Delete topic</span>
          <Icon onClick={this.onClose} className="archive" name="close" />
        </Modal.Header>
        <Modal.Content>
        <p>
            Are you sure you want to delete this topic?
        </p>
        <p>Title: {this.state.title}</p>
        <p>Description: {this.state.description}</p>
        <p>Date: { moment(this.state.date).format('LL')}</p>
        </Modal.Content>
        <Modal.Actions>
        <Button basic color='red' onClick={this.onClose}>
            <Icon name='remove' /> No
        </Button>
        <Button color='green' onClick={this.onSave}>
            <Icon name='checkmark' /> Yes
        </Button>
        </Modal.Actions>      
      </Modal>
    )
  }
}

export default TopicDelete
