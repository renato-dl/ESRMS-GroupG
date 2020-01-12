import React, { Component } from 'react'

import {Icon, Modal, Button, Divider, Header} from 'semantic-ui-react';

import {FileUpload} from '../../FileUpload/FileUpload';
import {FilePreview} from '../../FilePreview/FilePreview';

import {api} from '../../../services/api';

import toastr from 'toastr';
import mime from 'mime';

export class AddMaterial extends Component {
    state = {
        files: [],
        subjectId: this.props.subjectId,
        isSaving: false
    };

    onSave = async () => {
        if (this.state.isSaving) {
          return;
        }
    
        this.setState({isSaving: true});
    
        try {
        //   const formData = new FormData();
        //   formData.set('subjectId', this.state.subjectId);
        //   formData.set('title', this.state.title);
        //   formData.set('description', this.state.description);
        //   formData.set('dueDate', this.state.date.toISOString());
          
          //formData.set('attachments', JSON.stringify(this.state.attachments || []));
        const requests = [];
        this.state.files.forEach((file) => {
            try {
                const formData = new FormData();
                formData.set('subjectId', this.state.subjectId);
                formData.append('file', file);
                requests.push(formData);
                // const response = await api.teacher.AddMaterial(formData);
                // console.log(response);
            } catch (error) {
                console.log(error);
            }
        });

        const promises = requests.map((req) => api.teacher.addMaterialBySubjectId(req));
        try{
            await Promise.all(promises);
            toastr.success("Support material(s) added successfully!");
        }
        catch(e){
            this.setState({isSaving: false});
            toastr.error(e);
        }
    
        //   if(!this.state.id) {
        //     await api.teacher.addAssignment(formData);
        //     toastr.success(`Assignment ${this.state.id ? 'updated' : 'added'} successfully.`);
        //   } else {
        //     const reqResult = await api.teacher.updateAssignment(formData);  
            
        //     if (reqResult.data.success) {
        //       toastr.success('Assignment updated successfully.');
        //     } else {
        //       toastr.error(reqResult.data.message);
        //       this.setState({isSaving: false});
        //       return;
        //     }
        //   }
        } catch (e) {
          this.setState({isSaving: false});
          return toastr.error(e);
        }
        this.props.onClose();
    }


    onFileRemove = (name) => {
        this.setState({ files: this.state.files.filter((a) => a.name !== name)});
    };   

    onDrop = (files, event) =>{
        const currentFilesCount = this.state.files.length;
        if (files.length > this.props.maxFiles || (currentFilesCount + files.length) > this.props.maxFiles) {
        return toastr.error("Assignment cannot have more than 10 attachments!");
        }

        this.setState({ files: [...this.state.files, ...files] });
    }

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
                    {this.state.files.map((file, index) => (
                        <FilePreview 
                        key={index}
                        type={mime.getExtension(file.type)} 
                        name={file.name} 
                        onRemove={this.onFileRemove}
                        />
                    ))}
                    {this.state.files.length < this.props.maxFiles && <FileUpload onDropAccepted={this.onDrop} />}
                    {/* <FileUpload onDropAccepted={this.props.onDrop} /> */}
                
                </Modal.Content>
                <Modal.Actions>
                <Button color='green' onClick={this.onSave}>
                    <Icon name='checkmark' /> Confirm
                </Button>
                </Modal.Actions>      
            </Modal>
        )
    }
}

export default AddMaterial
