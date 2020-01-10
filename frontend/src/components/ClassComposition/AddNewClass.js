import React, { Component } from 'react';
import { Modal, Dropdown, Icon, Button } from 'semantic-ui-react';
import * as toastr from 'toastr';
import { api } from '../../services/api';

export class AddNewClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      teacherOptions: []
    }
  }

  async componentDidMount(){
    
    try{
      const teachers = await api.admin.getTeachers('');
      let options = [];
      if (teachers && teachers.data){
        teachers.data.forEach( e => {
          const teacherOption = {key: e.ID, value: e.ID, text: e.FirstName + " " + e.LastName};
          options.push(teacherOption);
        });
      }      
      this.setState({teacherOptions: options})
    }
    catch(e){
      //console.log(e);
    }
  }

  handleTeacherChange = (e, {value}) => {
    this.setState({selectedId: value});
  };

  onAddClass = async() => {
    const request = {
      coordinatorId: this.state.selectedId
    }
    try{
      const response = await api.admin.addNewClass(request);   

      if (response.data.success) {          
          toastr.success('Class added successfully!');
      } else {
          toastr.error(response.data.msg);
      }
    }
    catch(e){
      toastr.error(e);
    }   
    this.props.onSave();
    this.props.onClose();
  }

  render() {
    if (this.state.teacherOptions.length > 0){
      return (
        <Modal dimmer open className="grade-detail" size="small">
          <Modal.Header>
            <span>Add class</span>
            <Icon onClick={this.props.onClose} className="archive deleleIcon" name="close" />
          </Modal.Header>
          <Modal.Content>
          <p>To create a new class, please select a class coordinator.</p>
          
          <Dropdown 
            placeholder='Select teacher coordinator' 
            fluid
            selection
            value={this.selectedId}
            onChange={this.handleTeacherChange}
            options={this.state.teacherOptions} />
          </Modal.Content>
          <Modal.Actions>
          <Button color='green' disabled={!this.state.selectedId} onClick={this.onAddClass}>
              <Icon name='checkmark' /> Add new class
          </Button>
          </Modal.Actions>      
        </Modal> 
      )
    }
    else{
      return (
        <Modal dimmer open className="grade-detail" size="small">
          <Modal.Header>
            <span>Add class</span>
            <Icon onClick={this.props.onClose} className="archive deleleIcon" name="close" />
          </Modal.Header>
          <Modal.Content>
          <p>There are no available teacher coordinators.</p>
          </Modal.Content>
          <Modal.Actions>
          <Button color='green' disabled onClick={this.onAddClass}>
              <Icon name='checkmark' /> Add new class
          </Button>
          </Modal.Actions>      
        </Modal> 
      )
    }
  }
}

export default AddNewClass
