import React, { Component } from 'react';
import { Button, Modal, Icon} from 'semantic-ui-react';

import { api } from '../../../services/api';
import * as toastr from 'toastr';


export class TeacherDeleteMaterialConfirmation extends Component {
    state = {file:null}

    onDeleteFile = async () => {
        const obj = this.props.file;
        const request = {ID: obj.ID};
        try {
            const response = await api.teacher.deleteMaterialById(request);
            if(response && response.data && response.data.success){
                toastr.success(`${obj.Name} deleted!`);
                this.props.onDeleted();
            }
        } catch (error) {
            console.log(error);
            toastr.error(error);
        }
    }

    render() {
        return (
            <Modal dimmer open className="grade-detail" size="tiny">
                <Modal.Header>
                <span><Icon name="trash"/>Delete file</span>
                <Icon onClick={this.props.onClose} className="archive deleleIcon" name="close" />
                </Modal.Header>
                <Modal.Content>
                <h3>
                    Are you sure you want to delete file? 
                </h3>
                </Modal.Content>
                <Modal.Actions>
                <Button basic color='red' onClick={this.props.onClose}>
                    <Icon name='remove' /> No
                </Button>
                <Button color='green' onClick={this.onDeleteFile}>
                    <Icon name='checkmark' /> Yes
                </Button>
                </Modal.Actions>      
            </Modal>
        )
    }
}

export default TeacherDeleteMaterialConfirmation
