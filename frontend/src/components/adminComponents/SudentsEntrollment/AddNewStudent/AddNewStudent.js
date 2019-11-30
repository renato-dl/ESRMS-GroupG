import React, { Component } from 'react'
import './AddNewStudent.scss'

//import {Button, Modal, Form, Icon} from 'semantic-ui-react'
import FormStudentDetails from './Details/FormStudentDetails';
import FormParentDetails from './Details/FormParentDetails';

export class AddNewStudent extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            step:1,
            P1exists:false,
            P2exists:false,
            isSaving: false,
            errors: {},

            stud_FirstName:"",
            stud_LastName:"",
            stud_SSN:"",
            stud_Gender:"",
            stud_BirthDate: new Date(2013,1,1),

            p1_ID:"",
            p1_SSN:"",
            p1_FirstName:"",
            p1_LastName:"",
            p1_Email:"",

            p2_ID:"",
            p2_SSN:"",
            p2_FirstName:"",
            p2_LastName:"",
            p2_Email:""

            /* 
            studentData:{
    
                studentInfo:{
                    FirstName: "Mara", 
                    LastName: "M",
                    SSN: "juijgkl",
                    Gender: "F",
                    BirthDate: ""
                },
                firstParent:{
                    SSN: "",
                    FirstName: "",
                    LastName: "",
                    Email: "",
                },
                // optional:
                secondParent:{ 
                    SSN: "",
                    FirstName: "",
                    LastName: "",
                    Email: "", 
                }	
            } */
        }
      }


    // Cancel/Close Modal
    onClose = () => {
        if (this.state.isSaving) {
            return;
        }
        this.props.onClose();
    };

    //Proceed to next step
    nextStep = () => {
        const {step} = this.state;
        this.setState({
            step:step + 1
        });
    }

    //Go back to prev step
    prevStep = () => {
        const {step} = this.state;
        this.setState({
            step:step - 1
        });
    }
    //Handle fields change
    handleChange = input => e => {
        this.setState({[input]: e.target.value});
    }
    
    //handleStudentChange = input =>( e, {name, value}) => {
        //this.setState({[name]: value});
        //this.setState({ studentInfo: { ...this.state.studentData.studentInfo, [name]: value} });
    //}

    ConfirmEnrollment=()=>{
        console.log("ADDD CONFIRM");
        console.log(this.state);
    };



    render() {
        const {step} =  this.state;
        const values = this.state;
        

        switch(step){
            case 1:
                return (
                    <FormStudentDetails
                    nextStep = {this.nextStep}
                    handleChange = {this.handleChange}
                    //handleDateChange = {this.handleDateChange}
                    values = {values}
                    />
                );
            case 2:
                return (
                    <FormParentDetails
                    confirm = {this.ConfirmEnrollment}
                    prevStep = {this.prevStep}
                    handleChange = {this.handleChange}
                    values = {values}
                    />
                ); 
            default: return (<></>); 
        }

    }
}

export default AddNewStudent;
