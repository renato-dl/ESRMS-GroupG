import React from 'react';
import { api } from '../../services/api';
import './ChildAttendance.scss';
import { Calendar } from '../Calendar/Calendar';
import {AttendanceDetails} from'./AttendanceDetails/AttendanceDetails'
import { Icon,Container} from 'semantic-ui-react'
import moment from 'moment';
import {ApplicationStoreContext} from '../../store';
// function Event({ event }) {
//   return (
//     <span>
//       <strong>"hgfvjhgfghfchgfgh"</strong>
//       {event.desc && ':  ' + event.desc}
//     </span>
//   )
// }

// function EventAgenda({ event }) {
//   return (
//     <span>
//       <em style={{ color: 'magenta' }}>{event.title}</em>
//       <p>{event.desc}</p>
//     </span>
//   )
// }

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
                title:this.getDailyStatus(attendance.EarlyExit,attendance.LateEntry)
              }
            }
            ),
            attendance: response.data,
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
        const attendance = {...this.state.attendance.find((a) => a.ID === data.id)};
        this.setState({ attendanceDataForModal: attendance, attendanceModalOpen: true });
      }
    
    closeAttendanceModal = () => {
        this.setState({ attendanceDataForModal: null, attendanceModalOpen: false })
      }
    
    onNavigate = async (data) => {
      const from = moment(data).startOf('month').startOf('day').toDate().toISOString();
      const to = moment(data).endOf('month').endOf('day').toDate().toISOString();
      await this.fetchAttendance(from, to);
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
          //   components={{
          //     event: Event,
          //     agenda: {
          //       event: EventAgenda,
          //     },
          //   }
          // }
          />      
        
          </div>

        {this.state.attendanceModalOpen && 
          <AttendanceDetails
            attendance={this.state.attendanceDataForModal}
            onClose={this.closeAttendanceModal}
          />
        }
      </Container>
      )
    }
}
