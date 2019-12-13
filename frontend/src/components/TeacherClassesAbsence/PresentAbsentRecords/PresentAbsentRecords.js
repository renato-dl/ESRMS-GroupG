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

      console.log(date)
      try{
        const response = await api.teacher.getTeacherAttendance(cId, date);
        if (response) {
            this.setState({
                attendanceList:response.data.students, 
                rollCall: response.data.rollCall
            });
            console.log(this.state.attendanceList);
        }
      }
      catch(e){
        //
      }
    }

    async setDate(date){
        this.setState({date});
        await sleep(500);
        this.fetchAttendance();
    }

    getIcon(present, LateEntry, EarlyExit){
        let icn;
        switch(true) {
            case present == true && LateEntry == undefined && EarlyExit == undefined:
                icn = 'checkmark';
            break;
            case present == false :
                icn = 'delete';
            break;
            case LateEntry != undefined || EarlyExit != undefined:
                icn = 'clock outline';
            break;   
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
        console.log(this.state.absentStudArr)
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

        console.log(data);
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
                <Table color='teal'>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Surname</Table.HeaderCell>
                    {this.state.rollCall  && <Table.HeaderCell textAlign='left' >Attendance</Table.HeaderCell>}
                    {!this.state.rollCall && <Table.HeaderCell textAlign='center' >Mark as Absent</Table.HeaderCell>}
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
                        {student.Present !=undefined && <Icon name={this.getIcon(student.Present, student.LateEntry, student.EarlyExit)}/>}
                        {student.LateEntry && <Label basic pointing = "left" color="grey">Late Entry: {student.LateEntry}</Label>}
                        {student.EarlyExit && <Label basic pointing = "left" color="brown">Early Exit: {student.EarlyExit}</Label>}
                        {student.Present==undefined && <Label basic color="grey">No records</Label>}
                        </Table.Cell>
                    }
                    {!this.state.rollCall &&
                        <Table.Cell textAlign="center">
                        <Checkbox slider onChange={
                          (e) => this.onChecked(student.StudentId)}/>
                        </Table.Cell>
                    }
                    </Table.Row>
                )}
                </Table.Body>
                {!this.state.rollCall &&
                <Table.Footer fullWidth>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan='4'>
                    <Button onClick={this.submitAbsentStudents}
                        floated='right'icon labelPosition='left'
                        color="green" size='small'>
                        <Icon name='checkmark icon' /> Submit
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
