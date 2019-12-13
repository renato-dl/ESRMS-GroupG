import React, { Component } from 'react'
import { api } from '../../../services/api';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import './PresentAbsentRecords.scss';
import {Container, Icon, Label, Table} from 'semantic-ui-react';

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
            classID:null,
            className:null,

            date:new Date(),
            attendanceList:[
                {FirstName:"AAA", LastName: "BBB", SSN: "BDFCGZ82B13E488X", Present:"true", LateEntry: "2h"},
                {FirstName:"AAA", LastName: "BBB", SSN: "BDFCGZ82B13E488X", Attendance:"0"},
                {FirstName:"AAA", LastName: "BBB", SSN: "BDFCGZ82B13E488X", Attendance:"2"},
                {FirstName:"AAA", LastName: "BBB", SSN: "BDFCGZ82B13E488X", Attendance:"3"},

            ],
            absentStudents:[],
            rollCall:false
          }
         
      }

    async componentDidMount(){
        const cName = this.props.match.params.ClassName;
        const cId = this.props.match.params.ClassId;

        this.setState({
            className: cName,
            classID: cId,
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
        // Write your code here
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
                    <Table.HeaderCell>Attendance</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                {
                this.state.attendanceList.map((student, index) =>
                    <Table.Row key = {index}>
                    <Table.Cell width="1">{index +1}</Table.Cell>
                    <Table.Cell width="2">{student.FirstName}</Table.Cell>
                    <Table.Cell width="2">{student.LastName}</Table.Cell>
                    <Table.Cell width="4" textAlign="left">
                    {student.Present !=undefined && <Icon name={this.getIcon(student.Present, student.LateEntry, student.EarlyExit)}/>}
                    {student.LateEntry && <Label basic pointing = "left" color="grey">Late Entry: {student.LateEntry}</Label>}
                    {student.EarlyExit && <Label basic pointing = "left" color="brown">Early Exit: {student.EarlyExit}</Label>}
                    {student.Present==undefined && <Label basic color="grey">No records</Label>}
                    </Table.Cell>
                    </Table.Row>
                )}
                </Table.Body>
                </Table>

            </Container>
        )
    }
}

export default PresentAbsentRecords
