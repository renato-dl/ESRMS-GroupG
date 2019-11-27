import React, { Component } from 'react'

import {Table, Icon, Container} from 'semantic-ui-react';

export class admin_StudentsEnrollment extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            enrolledStudents:[],
            open_AddModal: false,
            open_EditModal: false
        }
      }
    

    //Opens Add Student Modal = AddNewStudent.js component
    addNewStudent = () => {
        this.setState({open_AddModal: true});
    };

    render() {
        return (
            <Container className="contentContainer">
                <h3 className="contentHeader">
                    <Icon name='braille'/>
                    Enroll Students
                </h3>
            
            <button className="ui vk button" onClick={this.addNewStudent}>
                <i className="user plus icon"></i>
                Add New Student
            </button>
            
            
            
            </Container>
        )
    }
}

export default admin_StudentsEnrollment
