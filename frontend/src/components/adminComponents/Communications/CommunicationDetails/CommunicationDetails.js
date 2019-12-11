import React from 'react';
import {Icon, Modal, Button, Form, Segment, Checkbox, Label} from 'semantic-ui-react';
import './CommunicationDetails.scss';
import DatePicker from "react-datepicker";

export class CommunicationDetails extends React.Component {
  state = {
    ID: null,
    Title: '',
    Description: '',
    IsImportant: false,
    DueDate: null,
    errors: {}
  }

  componentDidMount() {
    if (this.props.communication) {
      this.setState({ ...this.props.communication });
    }
  }

  onInputChange = ({target}) => {
    this.setState({[target.name]: target.value});
  }

  onImportantChange = () => {
    this.setState({ IsImportant: !this.state.IsImportant });
  }

  onDateChange = (date) => {
    this.setState({ DueDate: date });
  }

  onSave = () => {
    this.props.onSave({
      ID: this.state.ID,
      Title: this.state.Title,
      Description: this.state.Description,
      IsImportant: this.state.IsImportant,
      DueDate: this.state.DueDate,
    })
  }

  render() {
    return (
      <Modal dimmer open className="communication-details" size="small">
        <Modal.Header>
          <span>{this.state.ID ? this.state.Title : 'Add new communication'}</span>
          <Icon onClick={this.props.onClose} className="close-icn" name="close" />
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              error={this.state.errors['Title']}
              label='Title' 
              placeholder='Title'
              name='Title'
              maxLength ={255}
              value={this.state.Title}
              onChange={this.onInputChange}
            />
            <Form.TextArea
              error={this.state.errors['Description']}
              label='Description' 
              placeholder='Communication description'
              name='Description'
              value={this.state.Description}
              onChange={this.onInputChange}
            />
            <Form.Group className="communication-extra">
              <Segment compact className="custom" color="red">
                <Checkbox 
                  label={<label>Important</label>} 
                  id="important"
                  name="Important"
                  checked={this.state.IsImportant}
                  onClick={this.onImportantChange}
                />
              </Segment>
              <div className="date-picker">
                <Label>Expires at: </Label>
                <DatePicker
                  placeholderText="Expiration date"
                  name="DueDate"
                  minDate={new Date()}
                  selected={new Date(this.state.DueDate || Date.now())}
                  onChange={this.onDateChange}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='red' onClick={this.props.onClose}>
            <Icon name='remove' /> Close
          </Button>
          <Button positive onClick={this.onSave} disabled={!this.state.Title || !this.state.Description}>
            <Icon name='checkmark' /> Done
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
