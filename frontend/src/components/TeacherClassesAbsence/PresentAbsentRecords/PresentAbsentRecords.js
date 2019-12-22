import React, { Component } from 'react'
import { api } from '../../../services/api';
import "react-datepicker/dist/react-datepicker.css";
import './PresentAbsentRecords.scss';
import ConfirmationModal from './RecordDetails/ConfirmationModal';
//import * as toastr from 'toastr';
import moment from 'moment';
import {Container, Icon, Label, Table, Button, Checkbox} from 'semantic-ui-react';


import DatePicker , { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
registerLocale("en", en);


const CustomDateInput = ({ value, onClick }) => (
    <Label color='orange' size="big" onClick={onClick} style={{cursor:'pointer'}}>
      <Icon name='calendar alternate outline' /> {value}
    </Label>
);
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export class PresentAbsentRecords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classId:null,
            className:null,
            studentId:null,
            studentName:null,
            studentSurname:null,
            isSaving:false,
            date:new Date(),
            attendanceList:[],
            absentStudArr:[],
            rollCall:true,

            IsAbsenceRecord:false,
            IsLateEntryRecord:false,
            IsEarlyExitRecord:false,

            IsConfirmationOpen:false

          }
         
      }

    async componentDidMount(){
        const cName = this.props.match.params.ClassName;
        const cId = this.props.match.params.ClassId;

        this.setState({
            className: cName,
            classId: cId,
        })

        this.fetchAttendance();
    }

    fetchAttendance = async () => {
      const cId = this.props.match.params.ClassId;
      const date = this.state.date.toUTCString();
      //const date = this.state.date.toISOString();
      try{
        const response = await api.teacher.getTeacherAttendance(cId, date);
        if (response) {
            this.setState({
                attendanceList:response.data.students, 
                rollCall: response.data.rollCall
            });
        }
      }
      catch(e){
        //
      }
    }

    async setDate(date){
        this.setState({date});
        await sleep(10);
        this.fetchAttendance();
    }

    getIcon(present, LateEntry, EarlyExit){
        let icn;
        switch(true) {
            case present === true && LateEntry === undefined && EarlyExit === undefined:
                icn = 'checkmark';
            break;
            case present === false :
                icn = 'delete';
            break;
            /* case LateEntry !== undefined || EarlyExit !== undefined:
                icn = 'clock outline';
            break; */  
            default :
            icn = 'clock outline';
            break 
        }
        return icn;
    }

    onChecked = (e) => {
        let absentStudents = [...this.state.absentStudArr];
    
        if (!absentStudents.includes(e)) {
            absentStudents.push(e);
        }
        else {
            absentStudents = absentStudents.filter((s) => s !== e);
        }
        
        this.setState({ absentStudArr : absentStudents })
    }

    onConfirmationModalClose = () => {
        this.setState({IsConfirmationOpen: false});
    }
    
    submitAbsentStudents = async () => {
        this.setState({
            IsAbsenceRecord:true,
            IsLateEntryRecord:false,
            IsEarlyExitRecord:false,

            IsConfirmationOpen:true
        })
    }

    RecordLateEntry = async (student) => {
        this.setState({
            studentId: student.StudentId,
            studentName: student.FirstName,
            studentSurname: student.LastName,   

            IsAbsenceRecord:false,
            IsLateEntryRecord:true,
            IsEarlyExitRecord:false,

            IsConfirmationOpen:true
        
        });
    }

    RecordEarlyExit = async (student) => {
        this.setState({
            studentId: student.StudentId,
            studentName: student.FirstName,
            studentSurname: student.LastName,   

            IsAbsenceRecord:false,
            IsLateEntryRecord:false,
            IsEarlyExitRecord:true,

            IsConfirmationOpen:true
        
        });
    } 

    isWeekday = date => {
        const day = moment(date).day();
        return day !== 0;
    };
    
    render() {
        return (
            <Container className="Grades-container contentContainer">
                <h3 className="contentHeader">
                    <Icon name='tasks'/>
                    Attendance Records of Class {this.state.className}
                </h3>

                <DatePicker
                    locale="en"
                    selected={this.state.date}
                    onChange={date => this.setDate(date)}
                    customInput={<CustomDateInput/>}
                    dateFormat="MMMM d, yyyy"
                    maxDate={new Date()}
                    filterDate={this.isWeekday}
                />
                {!this.state.rollCall && this.state.date.getDate() !== new Date().getDate() && <h3 style={{color:'#959595'}}><Icon name='database'/>There are no attendance records for selected date </h3>}
                <Table color='teal'>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Surname</Table.HeaderCell>
                    {this.state.rollCall  && <Table.HeaderCell textAlign='left' >Attendance</Table.HeaderCell>}
                    {!this.state.rollCall && this.state.date.getDate() === new Date().getDate() && <Table.HeaderCell textAlign='center' >Mark as Absent</Table.HeaderCell>}
                    {this.state.rollCall &&  this.state.date.getDate() === new Date().getDate() && <Table.HeaderCell textAlign='center' >Operations</Table.HeaderCell>}
                </Table.Row>
                </Table.Header>

                <Table.Body>
                {
                this.state.attendanceList.map((student, index) =>
                    <Table.Row key = {index}>
                    <Table.Cell>{index +1}</Table.Cell>
                    <Table.Cell>{student.FirstName}</Table.Cell>
                    <Table.Cell>{student.LastName}</Table.Cell>
                    {this.state.rollCall  && 
                        <Table.Cell textAlign="left" width={4} className='attendanceCell'>
                        {student.LateEntry === undefined && student.EarlyExit === undefined && <Icon name={this.getIcon(student.Present, student.LateEntry, student.EarlyExit)}/>}
                        {student.LateEntry && <Label basic color="red" size="large"><Icon name="clock outline"/>Late Entry: {student.LateEntry}</Label>}
                        {student.EarlyExit && <Label basic color="red" size="large"><Icon name="hourglass half"/> Early Exit: {moment.utc(student.EarlyExit, 'HH:mm:ss').local().format('HH:mm')}</Label>}
                        {student.Present===undefined && <Label basic color="grey">No records</Label>}
                        </Table.Cell>
                    }
                    
                    {!this.state.rollCall && this.state.date.getDate() === new Date().getDate() &&
                        <Table.Cell textAlign="center">
                        <Checkbox slider onChange={
                          (e) => this.onChecked(student.StudentId)}/>
                        </Table.Cell>
                    }
                    
                    {this.state.rollCall && this.state.date.getDate() === new Date().getDate() &&
                        <Table.Cell textAlign="center">
                            {!student.Present  && student.LateEntry === undefined &&
                            <Button color="vk" size="tiny" onClick={()=>this.RecordLateEntry(student)} > 
                                <Icon name="clock outline"/> 
                                Record Late Entry
                            </Button>}
                            {(student.Present || student.LateEntry)  && student.EarlyExit === undefined &&
                            <Button color="linkedin" size="tiny" onClick={()=>this.RecordEarlyExit(student)}>
                                <Icon name="hourglass half"/> 
                                Record Early Exit
                            </Button>}
                        </Table.Cell>
                    }
                    </Table.Row>
                )}
                </Table.Body>
                {!this.state.rollCall && this.state.date.getDate() === new Date().getDate() &&
                <Table.Footer fullWidth>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan='4'>
                    <Button onClick={this.submitAbsentStudents}
                        floated='right'icon labelPosition='left'
                        color="green" size='small'>
                        <Icon name='checkmark' /> Submit
                    </Button>
                    </Table.HeaderCell>
                </Table.Row>
                </Table.Footer>
                }
                </Table>


                {this.state.IsConfirmationOpen &&
                <ConfirmationModal
                    dat = {this.state}
                    onClose={this.onConfirmationModalClose}
                    onSave={() => {
                        this.fetchAttendance();
                        this.onConfirmationModalClose();
                    }}
                />
                }
            </Container>
        )
    }
}

export default PresentAbsentRecords
