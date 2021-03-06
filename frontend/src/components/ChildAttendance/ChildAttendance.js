import React from 'react';
import { api } from '../../services/api';
import './ChildAttendance.scss';
import { Calendar } from '../Calendar/Calendar';
import { Icon, Container, Card, Button} from 'semantic-ui-react'
import moment from 'moment';
import {ApplicationStoreContext} from '../../store';

import {AttendanceDetailsAbsence} from'./AttendanceDetails/AttendanceDetailsAbsence'
import {AttendanceDetailsEarlyexit} from './AttendanceDetails/AttendanceDetailsEarlyexit'
import {AttendanceDetailsLateentry}from './AttendanceDetails/AttendanceDetailsLateentry'
import TotalFilteredAttendance from './AttendanceDetails/TotalFilteredAttendance';

export class ChildAttendance extends React.Component{
  static contextType = ApplicationStoreContext;
    constructor(props) {
      super(props);
      this.state = {
        attendance: [],
        attendanceForCalendar: [],
        attendanceModalOpen: false,
        attendanceDataForModal: null,
        attendanceNormal:null,

        totalEarlyExists:null,
        totalLateEntries:null,
        totalAbsene:null,
        totalYearArray:[],
        modalArr:[],
        modalTitle:null,
        isTotoalModalOpen: false
      }
    }

    filterRecords = (id) => {
      let records = [];
      this.state.totalYearArray.forEach(function(e){
          if(e.title == id){
            records.push(e);
          }
      });
      return records;
    }

    OpenTotalDetails = (title) => {
      this.setState({modalArr: this.filterRecords(title), modalTitle: title});
      this.setState({isTotoalModalOpen:true});
    }

    getYearRecords = async() => {
      let from = new Date(2019, 9, 1).toISOString();
      let to = new Date().toISOString();
      await this.fetchAttendance(from, to, true);
      this.setState({
        totalEarlyExists:this.filterRecords("Early Exit").length,
        totalAbsene:this.filterRecords("Absent").length,
        totalLateEntries:this.filterRecords("Late Entry").length,

      })
    }

    CloseTotalDetails = () =>{
      this.setState({isTotoalModalOpen:false, modalArr:[], modalTitle:null });
    }

    async componentDidMount() {
        await this.onNavigate(new Date());
        await this.getYearRecords();
      }
    
    fetchAttendance = async (from, to, forYearSummary) => {
        const student = this.context.state.parent.selectedStudent.ID;
        const response = await api.parent.getChildAttendance(student, from , to);
          if (response) {
           let attendances = response.data.reduce((allAttendances, attendance) => {
             if( attendance.LateEntry && attendance.EarlyExit){
               const newLocal = moment.utc(attendance.EarlyExit, 'HH:mm:ss').local().format('HH:mm');
               const firstAttendance = { ID: attendance.ID,
                Date: new Date(attendance.Date),
                title: "Early exit",
                EarlyExit: newLocal,
                ExitTeacherName: attendance.ExitTeacherName};
                const secondAttendance = { ID: attendance.ID,
                  Date: new Date(attendance.Date),
                  title: "Late entry",
                  LateEntry: attendance.LateEntry,
                  EntryTeacherName: attendance.EntryTeacherName};
                allAttendances.push(secondAttendance,firstAttendance);
             }
             else{
              allAttendances.push(attendance);
             }
             return allAttendances;
           }, []);
            if(!forYearSummary){
              this.setState({
                attendanceForCalendar: attendances.map((attendance) => {
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
                attendance: attendances
              })
            }else{
              this.setState({
                totalYearArray:attendances.map((attendance) => {
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
                })
              })
            }
        }
        await this.AddNormalLabel(from,to)
      };

    AddNormalLabel= async (from,to)=>{
      var startingDate = moment(from).startOf('day');
      var pre_date=moment().startOf('day');
     //var id_num=this.state.attendanceForCalendar.length;
      while(pre_date>=startingDate)
      {
      if(!this.state.attendanceForCalendar.find((a)=>moment(a.Date).isSame(pre_date,'day')))
      {
        //var week_day=moment(pre_date).day()
        /* if(week_day!==0){
          var element={
            id:++id_num,
            start: new Date(pre_date),
            end:new Date(pre_date),
            title: "Present"}
            this.state.attendanceForCalendar.push(element)
         } */
        }
      pre_date=moment(new Date(pre_date)).add(-1, 'days').startOf('day');
      }
      this.setState({attendanceNormal:0})
    }

    getDailyStatus =(EarlyExit,LateEntry)=>{
      if(EarlyExit==null&&LateEntry==null)
      {
      return 'Absent'
      }
      else if(EarlyExit==null&&LateEntry)
      {
      return 'Late Entry'
      }
      else if(EarlyExit&&LateEntry==null)
      {
      return 'Early Exit'
      }
      else 
        return 'Present'
     };

    
    handleEventClick = (data) => {
      this.setState({ attendanceDataForModal: data, attendanceModalOpen: true });
      }
    
    closeAttendanceModal = () => {
        this.setState({ attendanceDataForModal: null, attendanceModalOpen: false })
      }
    
    onNavigate = async (data) => {
      const from = moment(data).startOf('month').startOf('day').toDate().toISOString();
      const to = moment(data).endOf('month').endOf('day').toDate().toISOString();
      await this.fetchAttendance(from, to, false);
    } 

    eventPropGetter = (event) => {
      const status=event.title;
      if(status==='Absent')
        return {className:'red'};
      else if(status==='Late Entry')
        return {className:'orange'}
      else if(status==='Early Exit')
        return {className:'blue'}
      else return {className:'green'}
    }

    render(){
      return (
        <Container className="contentContainer">
        <h3 className="contentHeader"> 
          <Icon name='calendar check outline'/> 
          {this.context.state.parent ? this.context.state.parent.selectedStudent.FirstName + "'s" : 'Student'} attendance
         </h3>

         <Card.Group style={{marginBottom:"20px"}} centered>
          <Card color="red">
            <Card.Content><Card.Header textAlign="center" style ={{color: "#db2828"}}>
              <Icon name="warning circle"/> All Absences: {this.state.totalAbsene}</Card.Header>
            </Card.Content>
            <Card.Content extra><Button fluid basic color="red" onClick={() => {this.OpenTotalDetails("Absent")}}  disabled={this.state.totalAbsene===0}>
              <b>Details <Icon name="arrow right"/></b></Button>
            </Card.Content>
          </Card>

          <Card color="orange">
            <Card.Content><Card.Header textAlign="center" style ={{color: "#F2711C"}}>
              <Icon name="clock outline"/> All Late Entries: {this.state.totalLateEntries}</Card.Header>
            </Card.Content>
            <Card.Content extra><Button fluid basic color="orange" onClick={()=>{this.OpenTotalDetails("Late Entry")}} disabled={this.state.totalLateEntries===0}>
              <b>Details <Icon name="arrow right"/></b></Button>
            </Card.Content>
          </Card>

          <Card color="blue">
            <Card.Content><Card.Header textAlign="center" style ={{color: "#2185D0"}}>
              <Icon name="hourglass half"/> All Early Exits: {this.state.totalEarlyExists}</Card.Header>
            </Card.Content>
            <Card.Content extra><Button fluid basic color="blue" onClick={()=>{this.OpenTotalDetails("Early Exit")}} disabled = {this.state.totalEarlyExists===0}>
                <b>Details <Icon name="arrow right"/></b></Button>
            </Card.Content>
          </Card>
        </Card.Group>
          {this.state.isTotoalModalOpen &&
            <TotalFilteredAttendance
              modalArr={this.state.modalArr}
              modalTitle={this.state.modalTitle}
              onClose={this.CloseTotalDetails}
            />
          }
 
         <div className="calendarContainer">
           <Calendar 
            events={this.state.attendanceForCalendar}
            onDoubleClickEvent={this.handleEventClick}
            onNavigate={this.onNavigate}
            eventPropGetter={this.eventPropGetter}
          />      
          </div>

        {this.state.attendanceModalOpen && this.state.attendanceDataForModal.title==='Absent'&&
          <AttendanceDetailsAbsence
            attendance={this.state.attendanceDataForModal}
            onClose={this.closeAttendanceModal}
          />
        }
         {this.state.attendanceModalOpen && this.state.attendanceDataForModal.title==='Late Entry'&&
          <AttendanceDetailsLateentry
            attendance={this.state.attendanceDataForModal}
            onClose={this.closeAttendanceModal}
          />
        }

        {this.state.attendanceModalOpen && this.state.attendanceDataForModal.title==='Early Exit'&&
          <AttendanceDetailsEarlyexit
            attendance={this.state.attendanceDataForModal}
            onClose={this.closeAttendanceModal}
          />
        }
        
      </Container>
      )
    }
}
