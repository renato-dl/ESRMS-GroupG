import React, { Component } from 'react';
import {Button, Modal, Icon} from 'semantic-ui-react'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import {api} from '../../../services/api';
import * as toastr from 'toastr';

export class NoteDelete extends Component {
  state = {
    noteId: null,
    title: null,
    description: null,
    date: null,
    isSaving: false
  };

  componentDidMount() {
    const dNote = this.props.note;

    if (dNote) {
      try{
        this.setState({
          noteId: dNote.ID,
          title: dNote.Title,
          description: dNote.Description,
          date: dNote.date,
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
        ID: this.state.noteId
      }

      await api.teacher.deleteNote(request);
      toastr.success(`Note deleted successfully.`);           
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
          <span>Delete note</span>
          <Icon onClick={this.onClose} className="archive" name="close" />
        </Modal.Header>
        <Modal.Content>
        <h3>Are you sure you want to delete this note?</h3>
        <p><b>Title:</b> {this.state.title}</p>
        <p><b>Description:</b> {this.state.description}</p>
        <p><b>Date:</b> { moment(this.state.date).format('LL')}</p>
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

export default NoteDelete
