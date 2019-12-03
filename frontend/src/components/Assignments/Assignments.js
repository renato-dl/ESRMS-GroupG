import React from 'react';
import { api } from '../../services/api';
import './Assignments.scss';
import {Icon, Container} from 'semantic-ui-react';
import moment from 'moment';
import { AssignmentDetails } from './AssignmentDetails/AssignmentDetails';
import { Calendar } from '../Calendar/Calendar';

export class Assignments extends React.Component{
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
    const student = JSON.parse(localStorage.getItem('selectedChild'));
    const response = await api.parent.getChildAssignments(this.props.match.params.studentID || student, from , to);

    if (response) {
      this.setState({
        assignmentsForCalendar: response.data.map((assignment) => {
          return {
            id: assignment.ID,
            title: `${assignment.Description}`,
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

  render() {
    return (
      <Container className="contentContainer">
        <h3 className="contentHeader"> 
          <Icon name='braille'/> 
          {this.state.studentName ? this.state.studentName + "'s" : 'Student'} assignments
        </h3>

        <div className="calendarContainer">
          <Calendar 
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
