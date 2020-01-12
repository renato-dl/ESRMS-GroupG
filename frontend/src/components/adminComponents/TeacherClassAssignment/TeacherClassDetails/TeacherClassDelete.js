import React, { Component } from 'react';
import { Button, Modal, Icon} from 'semantic-ui-react';

import { api } from '../../../../services/api';
import * as toastr from 'toastr';

export class TeacherClassDelete extends Component {
    state= {id:null}

    onDeleteAssociation = async () => {
        const id = this.props.associationId;
        try{
        const response = await api.admin.deleteTeacherAssociation(id);
        if (response.data.success) {
            //await this.fetchTeacherClassData();
            toastr.success('Associaiton removed successfully!');
            this.props.onDeleted();
        } else {
            toastr.error(response.data.msg);
        }
        }
        catch(e){
        toastr.error(e);
        }
    }

    render() {
        return (
            <Modal dimmer open className="grade-detail" size="tiny">
                <Modal.Header>
                <span><Icon name="trash"/>Delete Association</span>
                <Icon onClick={this.props.onClose} className="archive deleleIcon" name="close" />
                </Modal.Header>
                <Modal.Content>
                <h3>
                    Are you sure you want to delete association? {this.state.id}
                </h3>
                </Modal.Content>
                <Modal.Actions>
                <Button basic color='red' onClick={this.props.onClose}>
                    <Icon name='remove' /> No
                </Button>
                <Button color='green' onClick={this.onDeleteAssociation}>
                    <Icon name='checkmark' /> Yes
                </Button>
                </Modal.Actions>      
            </Modal>
        )
    }
}

export default TeacherClassDelete
