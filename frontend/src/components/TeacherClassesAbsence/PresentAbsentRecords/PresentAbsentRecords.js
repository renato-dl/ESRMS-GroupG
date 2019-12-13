import React, { Component } from 'react'
import { api } from '../../../services/api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './PresentAbsentRecords.scss';
import * as toastr from 'toastr';
import {Container, Icon, Label, Table, Button, Checkbox} from 'semantic-ui-react';


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
            isSaving:false,

            date:new Date(),
            attendanceList:[],
            absentStudArr:[],
            rollCall:true
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

    
    submitAbsentStudents = async () => {
        if (this.state.isSaving) {
        return;
        }

        this.setState({isSaving: true});

        const data = {
            classId: this.state.classId,
            students: this.state.absentStudArr
        }

        try {
        await api.teacher.registerBulkAbsence(data);
            toastr.success("Absent Students are registered!"); 
        } catch(e) {
            toastr.error(e);
        }

        this.setState({ 
            isSaving: false,
            absentStudArr:[]
        });
        await this.fetchAttendance();
    }

    RecordLateEntry = async (student) => {
        if (this.state.isSaving) {return;}
        this.setState({isSaving: true});

        const data = {studentId: student.StudentId}
        try {
            await api.teacher.recordLateEntry(data);
                toastr.success("Student Information is updated!"); 
        } catch(e) {
            toastr.error(e);
        }
    
        this.setState({isSaving: false});
        await this.fetchAttendance();
    }

    RecordEarlyExit = async (student) => {
        if (this.state.isSaving) {return;}
        this.setState({isSaving: true});

        const data = {studentId: student.StudentId}
        try {
            await api.teacher.recordEarlyExit(data);
                toastr.success("Student Information is updated!"); 
        } catch(e) {
            toastr.error(e);
        }
    
        this.setState({isSaving: false});
        await this.fetchAttendance();
    }
    
    render() {
        return (
            <Container className="Grades-container contentContainer">
                <h3 className="contentHeader">
                    <Icon name='tasks'/>
                    Attendance Records of Class {this.state.className}
                </h3>

                <DatePicker
                selected={this.state.date}
                onChange={date => this.setDate(date)}
                customInput={<CustomDateInput/>}
                dateFormat="MMMM d, yyyy"
                maxDate={new Date()}
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
                        {student.EarlyExit && <Label basic color="red" size="large"><Icon name="hourglass half"/> Early Exit: {student.EarlyExit}</Label>}
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

            </Container>
        )
    }
}

export default PresentAbsentRecords
