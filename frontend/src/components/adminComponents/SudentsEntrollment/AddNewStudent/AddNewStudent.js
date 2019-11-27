import React, { Component } from 'react'

import {Button, Modal, Form, Icon} from 'semantic-ui-react'

import {api} from '../../../services/api';
import { withRouter } from "react-router";
import validator from 'validator';
import {SSNRegexp} from '../../../utils';
import * as toastr from 'toastr';

export class AddNewStudent extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            step:1,
            P1exists:false,
            P2exists:false,
            errors: {},

            studentData:{
    
                studentInfo:{
                    FirstName: "", 
                    LastName: "",
                    SSN: "",
                    Gender: "",
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
            }
        }
      }

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
    handleChange = input =>( e, {name, value}) => {
        this.setState({[name]: value});
    }



    render() {
        const {step} =  this.state;

        switch(step){
            case 1:
            
            return (
                <FormUserDetails
                nextStep = {this.nextStep}
                handleChange = {this.handleChange}
                values = {values}
                />
            )
            case 2:
                return (
                    <FormPersonalDetails
                    nextStep = {this.nextStep}
                    prevStep = {this.prevStep}
                    handleChange = {this.handleChange}
                    values = {values}
                    />
                )
            case 3:
                    return (
                        <Confirm
                        nextStep = {this.nextStep}
                        prevStep = {this.prevStep}
                        values = {values}
                        />
                    )
            case 4:
                return <Success />;

            }
        return (
            <div>
                
            </div>
        )
    }
}

export default AddNewStudent
