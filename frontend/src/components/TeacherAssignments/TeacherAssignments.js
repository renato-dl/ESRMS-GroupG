import React, { Component } from 'react';
import { api } from '../../services/api';
import {
  Icon,
  Container, 
  Button
} from 'semantic-ui-react';
import moment from 'moment';
import { TeacherAssignmentDetails } from './TeacherAssignmentDetails/TeacherAssignmentDetails';
import {ApplicationStoreContext} from '../../store';
import { TeacherAssignmentCalendar } from './TeacherAssignmentCalendar/TeacherAssignmentCalendar.js';
import { TeacherAssignment } from './TeacherAssignmentDetails/TeacherAssignment';

export class TeacherAssignments extends Component {
  static contextType = ApplicationStoreContext;

  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      assignmentsForCalendar: [],
      assignmentModalOpen: false,
      assignmentDataForModal: null,
      isAssignmentOpen: false, 
      classID: null, 
      subjectID: null
    }
  }

  async componentDidMount() {
    await this.fetchAssignments();
  }

  fetchAssignments = async (from, to) => {
    const fromDate = moment().startOf('month').startOf('day').toDate().toISOString();
    const toDate = moment().endOf('month').endOf('day').toDate().toISOString();
    const subjectId = this.props.match.params.subjectID;
    const classId = this.props.match.params.classID;
    this.setState({classID: classId, subjectID: subjectId});
    const response = await api.teacher.getAssignments(subjectId, classId, fromDate, toDate);

    if (response) {
      this.setState({
        assignmentsForCalendar: response.data.map((assignment) => {
          return {
            id: assignment.ID,
            title: assignment.Title,
            start: new Date(assignment.DueDate),
            end: new Date(assignment.DueDate)
          }
        }),
        assignments: response.data
      })
    }
  };

  handleEventClick = (data) => {
    const assignment = {...this.state.assignments.find((a) => a.ID === data.id)};
    this.setState({ assignmentDataForModal: assignment, assignmentModalOpen: true });
  }

  handleSelectEvent = (data) =>{
    const assignment = {...this.state.assignments.find((a) => a.ID === data.id)};
    this.setState({ assignmentDataForModal: assignment, isAssignmentOpen: true });
  }

  addAssignment = () => {
    this.setState({ assignmentDataForModal: null, assignmentModalOpen: false , isAssignmentOpen: true})
  }

  updateAssignment = (assignment) => {
    this.setState({ assignmentDataForModal: assignment, assignmentModalOpen: false , isAssignmentOpen: true})
  }

  deleteAssignment = (assignment) => {
    this.setState({ assignmentDataForModal: assignment, assignmentModalOpen: false , isAssignmentOpen: true})
  }
 
  closeAssignmentModal = () => {
    this.setState({ assignmentDataForModal: null, assignmentModalOpen: false , isAssignmentOpen: false})
  }

  onNavigate = async (data) => {
    const from = moment(data).startOf('month').startOf('day').toDate().toISOString();
    const to = moment(data).endOf('month').endOf('day').toDate().toISOString();
    await this.fetchAssignments(from, to);
  }

  // NOTE: This is an example of how to add a class to the event and style it.
  // please assign your custom class name and also don't forget to add the style to Calendar.scss and global.scss
  eventPropGetter = (event) => {
    const colors = ['red', 'blue', 'orange'];
    const dateNumber = moment(event.end).date();
    const randomIndex = parseInt((dateNumber + (Math.random() * 10)) % colors.length);
    const className = colors[randomIndex];

    return { className: className };
  }

  render() {
    return(
      <Container className="contentContainer">
        <h3 className="contentHeader"> 
          <Icon name='braille'/> 
          {this.props.match.params.subjectName} assignments
        </h3>
        <Button className="ui vk button" onClick={this.addAssignment}>
          <i className="plus icon"></i>
          New
        </Button>
        <div className="calendarContainer">
          <TeacherAssignmentCalendar
            eventPropGetter={this.eventPropGetter}
            events={this.state.assignmentsForCalendar}
            onDoubleClickEvent={this.handleEventClick}
            onNavigate={this.onNavigate}
          />
        </div>

        {this.state.assignmentModalOpen && 
          <TeacherAssignmentDetails 
            assignment={this.state.assignmentDataForModal}
            onUpdate={this.updateAssignment}
            onDelete={this.deleteAssignment}
            onClose={this.closeAssignmentModal}
          />
        }

        {this.state.isAssignmentOpen &&
          <TeacherAssignment 
            assignment={this.state.assignmentDataForModal}
            classId={this.state.classID}
            subjectId={this.state.subjectID}
            onSave={() =>{
              this.fetchAssignments();
              this.closeAssignmentModal();
            }}
            onClose={this.closeAssignmentModal}
          />
        }
      </Container>
    )
  }
}

export default TeacherAssignments
