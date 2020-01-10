import React, { Component } from 'react'

import {Icon, Modal, Button, Divider, Header} from 'semantic-ui-react';

import {FileUpload} from '../../FileUpload/FileUpload';

export class AddMaterial extends Component {
    render() {
        return (
            <Modal dimmer open className="grade-detail" size="small">
                <Modal.Header>
                    <span><Icon name ="plus"/>Add Support Material</span>
                    <Icon onClick={this.props.onClose} className="archive deleleIcon" name="close" />
                </Modal.Header>
                <Modal.Content>
                    <Divider horizontal>
                    <Header as='h4'>
                        {/* <Icon name='book' /> */}
                        Mathematics
                    </Header>
                    </Divider>
                    <FileUpload onDropAccepted={this.props.onDrop} />
                
                </Modal.Content>
                <Modal.Actions>
                <Button color='green'>
                    <Icon name='checkmark' /> Confirm
                </Button>
                </Modal.Actions>      
            </Modal>
        )
    }
}

export default AddMaterial
