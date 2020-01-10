import React from 'react';
import { api } from '../../services/api';
import './Assignments.scss';
import {Icon, Container} from 'semantic-ui-react';
import moment from 'moment';
import { AssignmentDetails } from './AssignmentDetails/AssignmentDetails';
import {ApplicationStoreContext} from '../../store';
import { Calendar } from '../Calendar/Calendar';

export class Assignments extends React.Component {
  static contextType = ApplicationStoreContext;

  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      assignmentsForCalendar: [],
      assignmentModalOpen: false,
      assignmentDataForModal: null
    }
  }

  async componentDidMount() {
    await this.fetchAssignments();
  }

  fetchAssignments = async (from, to) => {
    const student = this.context.state.parent.selectedStudent.ID;
    const response = await api.parent.getChildAssignments(student, from , to);

    if (response) {
      this.setState({
        assignmentsForCalendar: response.data.map((assignment) => {
          return {
            id: assignment.ID,
            title: `${assignment.Name}: ${assignment.Title}`,
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

  closeAssignmentModal = () => {
    this.setState({ assignmentDataForModal: null, assignmentModalOpen: false })
  }

  onNavigate = async (data) => {
    const from = moment(data).startOf('month').startOf('day').toDate().toISOString();
    const to = moment(data).endOf('month').endOf('day').toDate().toISOString();
    await this.fetchAssignments(from, to);
  }

  // NOTE: This is an example of how to add a class to the event and style it.
  // please assign your custom class name and also don't forget to add the style to Calendar.scss and global.scss
  eventPropGetter = (event) => {
    let className = 'green'
    if (moment(event.start).isSameOrBefore(moment(), 'day')) {
      className = 'red';
    } else if (moment(event.start).isBetween(moment(), moment().add(3, 'days'), 'day')) {
      className = 'orange'
    }

    return { className: className };
  }

  render() {
    return (
      <Container className="contentContainer">
        <h3 className="contentHeader"> 
          <Icon name='home'/> 
          {this.context.state.parent ? this.context.state.parent.selectedStudent.FirstName + "'s" : 'Student'} assignments
        </h3>

        <div className="calendarContainer">
          <Calendar
            eventPropGetter={this.eventPropGetter}
            events={this.state.assignmentsForCalendar}
            onDoubleClickEvent={this.handleEventClick}
            onNavigate={this.onNavigate}
          />
        </div>

        {this.state.assignmentModalOpen && 
          <AssignmentDetails 
            assignment={this.state.assignmentDataForModal}
            onClose={this.closeAssignmentModal}
          />
        }
      </Container>
    );
  }
}
