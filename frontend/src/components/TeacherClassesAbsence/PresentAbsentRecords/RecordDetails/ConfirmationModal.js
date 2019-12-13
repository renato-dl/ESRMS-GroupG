import React from 'react';
import {Button, Modal, Icon} from 'semantic-ui-react';
import {api} from '../../../../services/api';
import * as toastr from 'toastr';

export class ConfirmationModal extends React.Component {
    state = {
        studentId: null,
        studentName:'',
        studentSurname:'',
        classId:'',
        absentStudArr:[],

        IsAbsenceRecord:false,
        IsLateEntryRecord:false,
        IsEarlyExitRecord:false,
    
        isSaving: false
    };
    
    componentDidMount() {
        const {dat} = this.props;
        
        if (dat) {
          this.setState({
            studentId: dat.studentId,
            studentName: dat.studentName,
            studentSurname: dat.studentSurname,
            classId: dat.classId,
            absentStudArr: dat.absentStudArr,

            IsAbsenceRecord: dat.IsAbsenceRecord,
            IsLateEntryRecord: dat.IsLateEntryRecord,
            IsEarlyExitRecord: dat.IsEarlyExitRecord
          });
        }
    }
    
    onClose = () => {
        if (this.state.isSaving) {
          return;
        }
        this.props.onClose();
    };

    onSave = async() => {
        if (this.state.isSaving) {
            return;
        }

        this.setState({isSaving: true});

        if(this.state.IsAbsenceRecord){
            await this.submitAbsentStudents();
        }else if(this.state.IsLateEntryRecord){
            await this.RecordLateEntry();
        }else if(this.state.IsEarlyExitRecord){
            await this.RecordEarlyExit();
        }

        this.setState({isSaving: false});
        this.props.onSave();
    }


    submitAbsentStudents = async () => {
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
        return;
    }

    RecordLateEntry = async () => {
        const data = {studentId: this.state.studentId}
        try {
        await api.teacher.recordLateEntry(data);
            toastr.success("Late Entry is recorded!"); 
        } catch(e) {
            toastr.error(e);
        }
        return;
    }

    RecordEarlyExit = async () => {
        const data = {studentId: this.state.studentId}
        try {
        await api.teacher.recordEarlyExit(data);
            toastr.success("Early Exit is recorded!"); 
        } catch(e) {
            toastr.error(e);
        }
        return;
    }


    render() {
        return (
            <Modal dimmer open className="account-detail" size="tiny">

                {this.state.IsAbsenceRecord &&<>
                    <Modal.Header>
                        <span>Present/Absent Record Confirmation</span>
                        <Icon onClick={this.onClose} className="archive deleteIconModal" name="close" />
                    </Modal.Header>
                    <Modal.Content>
                        <h3>Are you sure you want to record selected students as absent?</h3>
                        <p>All students will be recorded as 'Present' if no student is selected.</p>
                    </Modal.Content>
                </>}

                {this.state.IsLateEntryRecord && <>
                    <Modal.Header>
                        <span>Late Entry Record Confirmation</span>
                    </Modal.Header>
                    <Modal.Content>
                        <h3>Are you sure you want to record late entry for  <br/><b>{this.state.studentName} {this.state.studentSurname}?</b></h3>
                    </Modal.Content>
                </>}
                
                {this.state.IsEarlyExitRecord && <>
                    <Modal.Header>
                        <span>Early Exit Record Confirmation</span>
                    </Modal.Header>
                    <Modal.Content>
                <h3>Are you sure you want to record Early Exit for <br/><b>{this.state.studentName} {this.state.studentSurname}</b>?</h3>
                    </Modal.Content>
                </>}
                
                <Modal.Actions>
                <Button basic color='red' onClick={this.onClose}>
                    <Icon name='remove' /> No
                </Button>
                <Button color='green' onClick={this.onSave}>
                    <Icon name='checkmark' /> Yes
                </Button>
                </Modal.Actions>      
            </Modal>
        )
    }
}

export default ConfirmationModal
