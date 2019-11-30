import React, { Component } from 'react'
import {Icon, Modal, Container, Button} from 'semantic-ui-react';
//import {api} from '../../../services/api';
//import moment from 'moment';

import AddNewStudent from './AddNewStudent/AddNewStudent';
//import { NoData } from '../../NoData/NoData';

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

    onAddModalClose = () => {
        this.setState({open_AddModal: false});
    };

    render() {
        return (
            <Container className="contentContainer">
                <h3 className="contentHeader">
                    <Icon name='braille'/>
                    Students Configuration
                </h3>
            
            <Button className="ui vk button" onClick={this.addNewStudent}>
                <i className="user plus icon"></i>
                Enroll a Student
            </Button>
            {/* <Button className="google plus" floated="right" disabled>
                <Icon name="upload"/>
                Upload Excel File
            </Button> */}
            
            
            
            {this.state.open_AddModal &&
                <Modal dimmer open className="topic-detail" size="small">
                    <Modal.Header>
                        <span>STUDENT ENROLLMENT</span>
                        <Icon onClick={this.onAddModalClose} className="close-icn" name="close" />
                    </Modal.Header>
                    <Modal.Content>
                        <AddNewStudent
                            ConfirmEnrollment={() => {
                                //refresh enrolled students table
                                this.onAddModalClose();
                            }}/>
                    </Modal.Content>
                </Modal>
            }

            
            </Container>
        )
    }
}

export default admin_StudentsEnrollment
