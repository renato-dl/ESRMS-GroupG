import React from 'react';
import { api } from '../../services/api';
import './ChildAttendance.scss';
import { Calendar } from '../Calendar/Calendar';
import { Icon,Container} from 'semantic-ui-react'
import moment from 'moment';
import {ApplicationStoreContext} from '../../store';

import {AttendanceDetailsAbsence} from'./AttendanceDetails/AttendanceDetailsAbsence'
import {AttendanceDetailsEarlyexit} from './AttendanceDetails/AttendanceDetailsEarlyexit'
import {AttendanceDetailsEexitLentry} from'./AttendanceDetails/AttendanceDetailsEexitLentry'
import {AttendanceDetailsLateentry}from './AttendanceDetails/AttendanceDetailsLateentry'

export class ChildAttendance extends React.Component{
  static contextType = ApplicationStoreContext;
    constructor(props) {
      super(props);
      this.state = {
        attendance: [],
        attendanceForCalendar: [],
        attendanceModalOpen: false,
        attendanceDataForModal: null
      }
    }

    async componentDidMount() {
        await this.onNavigate(new Date());
      }
    
    fetchAttendance = async (from, to) => {
        const student = this.context.state.parent.selectedStudent.ID;
        const response = await api.parent.getChildAttendance(student, from , to);
          console.log(response)
          if (response) {
           this.setState({
            attendanceForCalendar: response.data.map((attendance) => {
              return {
                id: attendance.ID,
                start: new Date(attendance.Date),
                end: new Date(attendance.Date),
                Date:attendance.Date,
                title:this.getDailyStatus(attendance.EarlyExit,attendance.LateEntry),
                EarlyExit: attendance.EarlyExit,
                LateEntry:attendance.LateEntry,
                EntryTeacherName:attendance.EntryTeacherName,
                ExitTeacherName: attendance.ExitTeacherName
              }
            }
            ),
            attendance: this.state.attendanceForCalendar
          })
        }
      };



    getDailyStatus =(EarlyExit,LateEntry)=>{
      if(EarlyExit==null&&LateEntry==null)
      {
      return 'Absence'
      }
      else if(EarlyExit==null&&LateEntry)
      {
      return 'LateEntry'
      }
      else if(EarlyExit&&LateEntry==null)
      {
      return 'EarlyExit'
      }
      else if(EarlyExit&&LateEntry)
      return 'EarlyExit&LateEntry'
      else 
      return 'Normal'
     };

    
    handleEventClick = (data) => {
      console.log(data)
        //const attendance = {...this.state.attendance.find((a) => a.ID === data.id)};
        this.setState({ attendanceDataForModal: data, attendanceModalOpen: true });
      }
    
    closeAttendanceModal = () => {
        this.setState({ attendanceDataForModal: null, attendanceModalOpen: false })
      }
    
    onNavigate = async (data) => {
      const from = moment(data).startOf('month').startOf('day').toDate().toISOString();
      const to = moment(data).endOf('month').endOf('day').toDate().toISOString();
      await this.fetchAttendance(from, to);
    } 
    eventPropGetter = (event) => {
      const colors = ['red', 'blue', 'yellow'];
      const dateNumber = moment(event.end).date();
      const randomIndex = parseInt((dateNumber + (Math.random() * 10)) % colors.length);
      const className = colors[randomIndex];
  
      return { className: className };
    }

    render(){
      return (
        <Container className="contentContainer">
        <h3 className="contentHeader"> 
          <Icon name='braille'/> 
          {this.context.state.parent ? this.context.state.parent.selectedStudent.FirstName + "'s" : 'Student'} attendance
         </h3>
 
         <div className="calendarContainer">
           <Calendar 
            events={this.state.attendanceForCalendar}
            onDoubleClickEvent={this.handleEventClick}
            onNavigate={this.onNavigate}
            eventPropGetter={this.eventPropGetter}
          />      
        
          </div>

        {this.state.attendanceModalOpen && this.state.attendanceDataForModal.title=='Absence'&&
          <AttendanceDetailsAbsence
            attendance={this.state.attendanceDataForModal}
            onClose={this.closeAttendanceModal}
          />
        }
         {this.state.attendanceModalOpen && this.state.attendanceDataForModal.title=='LateEntry'&&
          <AttendanceDetailsLateentry
            attendance={this.state.attendanceDataForModal}
            onClose={this.closeAttendanceModal}
          />
        }
        {this.state.attendanceModalOpen && this.state.attendanceDataForModal.title=='EarlyExit&LateEntry'&&
          <AttendanceDetailsEexitLentry
            attendance={this.state.attendanceDataForModal}
            onClose={this.closeAttendanceModal}
          />
        }
      </Container>
      )
    }
}
