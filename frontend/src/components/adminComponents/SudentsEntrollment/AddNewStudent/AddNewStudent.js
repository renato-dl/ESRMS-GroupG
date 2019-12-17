import React, { Component } from 'react'
import './AddNewStudent.scss'

import { api } from '../../../../services/api';
import * as toastr from 'toastr';

//import {Button, Modal, Form, Icon} from 'semantic-ui-react'
import FormStudentDetails from './Details/FormStudentDetails';
import FormParentDetails from './Details/FormParentDetails';

export class AddNewStudent extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            step:1,
            isSaving: false,

            stud_errors: {},

            stud_FirstName:"",
            stud_LastName:"",
            stud_SSN:"",
            stud_Gender:"",
            stud_BirthDate: new Date(2013,1,1),

            parent_errors: {},

            p1_ID:"",
            p1_SSN:"",
            p1_FirstName:"",
            p1_LastName:"",
            p1_Email:"",

            activeIndex: 0, // Accordion-Parent Form 
            p2_ID:"",
            p2_SSN:"",
            p2_FirstName:"",
            p2_LastName:"",
            p2_Email:""
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

    isEmptyStr(str) {
        return (!str || 0 === str.length);
    }

    collectSubmitData() {
        let cnfrmDat = {};
        //STUDENT
        cnfrmDat.studentInfo = {
            SSN: this.state.stud_SSN.trim(),
            FirstName: this.state.stud_FirstName,
            LastName: this.state.stud_LastName,
            Gender: this.state.stud_Gender,
            BirthDate: this.state.stud_BirthDate
        }
        //FIRST PARENT
        if (this.isEmptyStr(this.state.p1_ID)){
            cnfrmDat.firstParent = {
                SSN: this.state.p1_SSN.trim(),
                FirstName: this.state.p1_FirstName,
                LastName: this.state.p1_LastName,
                Email: this.state.p1_Email
            }
        }else{cnfrmDat.firstParent = {ID: this.state.p1_ID}}
        //SECOND PARENT
        if(this.state.activeIndex === 1){
            if (this.isEmptyStr(this.state.p2_ID)){
                cnfrmDat.secondParent = {
                    SSN: this.state.p2_SSN.trim(),
                    FirstName: this.state.p2_FirstName,
                    LastName: this.state.p2_LastName,
                    Email: this.state.p2_Email
                }
            }else{cnfrmDat.secondParent = {ID: this.state.p2_ID}}
        }

        return cnfrmDat;
    }
    

    ConfirmEnrollment = async () => {
        console.log("ADDD CONFIRM");
        console.log(this.state);
        if (this.state.isSaving){
            return;
        }

        this.setState({isSaving: true});

        try{
            const data = this.collectSubmitData();
            await api.admin.insertNewStudent(data);
            toastr.success(`Student Enrolled successfully `);
        }catch(e){
            this.setState({isSaving: false});
            return toastr.error(e);
        }

        this.setState({isSaving: false});
        this.props.ConfirmEnrollment();
    };



    render() {
        const {step} =  this.state;
        const values = this.state;
        

        switch(step){
            case 1:
                return (
                    <FormStudentDetails
                    nextstep = {this.nextStep}
                    handleChange = {this.handleChange}
                    //handleDateChange = {this.handleDateChange}
                    values = {values}
                    />
                );
            case 2:
                return (
                    <FormParentDetails
                    nextconfirm = {this.ConfirmEnrollment}
                    prevstep = {this.prevStep}
                    handleChange = {this.handleChange}
                    values = {values}
                    />
                ); 
            default: return (<></>); 
        }

    }
}

export default AddNewStudent;
