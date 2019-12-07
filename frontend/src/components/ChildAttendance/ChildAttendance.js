import React from 'react';
import { api } from '../../services/api';
import './ChildAttendance.scss';
import { Calendar } from '../Calendar/Calendar';
import {AttendanceDetails} from'./AttendanceDetails/AttendanceDetails'
import {
  Table,
  Button,
  Icon,
  Container,
  Modal
} from 'semantic-ui-react'
import moment from 'moment';
import { NoData } from '../NoData/NoData';

export class ChildAttendance extends React.Component{
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
        await this.fetchAttendance();
      }


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
        return 'Normal'
    };


    
    fetchAttendance = async (from, to) => {
        const student = JSON.parse(localStorage.getItem('selectedChild'));
     // const response = await api.parent.getChildAttendance(this.props.match.params.studentID || student, from , to);
     const response=[     
     {
        "ID": 1,
        "StudentID": "868d6ec1dfc8467f6d260c48b5620543",
        "Date": "2019-12-09T23:00:00.000Z",
        "TeacherId": "26ce21c0-8d32-41d1-8d07-b4994fa53edf",
        "EarlyExit": null,
        "LateEntry": null
    },
    {
        "ID": 2,
        "StudentID": "868d6ec1dfc8467f6d260c48b5620543",
        "Date": "2019-12-10T23:00:00.000Z",
        "TeacherId": "6d361d43-1308-4ac6-95ab-580138de9141",
        "EarlyExit": null,
        "LateEntry": "2h"
    },
    {
        "ID": 3,
        "StudentID": "868d6ec1dfc8467f6d260c48b5620543",
        "Date": "2019-12-11T23:00:00.000Z",
        "TeacherId": "6e5c9976f5813e59816b40a814e29899",
        "EarlyExit": "11:30:00",
        "LateEntry": "1h"
    }]
        if (response) {
          this.setState({
            attendanceForCalendar: response.map((attendance) => {
              return {
                id: attendance.ID,
                start: new Date(attendance.Date),
                end: new Date(attendance.Date),
                title:this.getDailyStatus(attendance.EarlyExit,attendance.LateEntry),
                TeacherId:attendance.TeacherId,
                EarlyExit:attendance.EarlyExit,
                LateEntry:attendance.LateEntry
              }
            }),
            attendance: response
          })
        }
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
          {this.state.studentName ? this.state.studentName + "'s" : 'Student'} Attendance
        </h3>
 
         <div className="calendarContainer">
           <Calendar 
            events={this.state.attendanceForCalendar}
            onDoubleClickEvent={this.handleEventClick}
            onNavigate={this.onNavigate}
            components={{
                event: Event
              }}
          />      

        
          </div>

        {this.state.attendanceModalOpen && 
          <AttendanceDetails 
            assignment={this.state.attendanceDataForModal}
            onClose={this.closeAttendanceModal}
          />
        }
      </Container>
      )
    }
}
