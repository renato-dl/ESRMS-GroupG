import React, { Component } from 'react'
import {TimetableUpload} from '../../FileUpload/TimetableUpload';
import {FilePreview} from '../../FilePreview/FilePreview';
import {Table, Icon, Modal, Button} from 'semantic-ui-react';
import mime from 'mime';
import xlsx from 'node-xlsx';

export class TimetableAdd extends Component {
  state = {
    file: null, 
    classTimetable: null
  };

  onDrop = (files) => {
    this.setState({ file: files[0] });
    this.parseFile(files[0]);
  }

  onAttachmentRemove = (name) => {
    this.setState({ file: null});
  };

  parseFile(file){
    const dirname = file.path;
    const workSheetsFromFile = xlsx.parse(`${dirname}/${file.name}`);
  }

  render() {
    return (
      <Modal dimmer open className="class-composition-detail" size="small">
      <Modal.Header>
        <span>Class timetable</span>
        <Icon onClick={this.props.onClose} className="close-icn" name="close" />
      </Modal.Header>
      <Modal.Content>
      {!this.state.classTimetable && 
      <Table columns='6'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan='6'>Example</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>
              Hour
            </Table.HeaderCell>
            <Table.HeaderCell>
              Mon
            </Table.HeaderCell>
            <Table.HeaderCell>
              Tue
            </Table.HeaderCell>
            <Table.HeaderCell>
              Wed
            </Table.HeaderCell>
            <Table.HeaderCell>
              Thu
            </Table.HeaderCell>
            <Table.HeaderCell>
              Fri
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>08:00</Table.Cell>
            <Table.Cell>Math</Table.Cell>
            <Table.Cell>History</Table.Cell>
            <Table.Cell>Italian</Table.Cell>
            <Table.Cell>English</Table.Cell>
            <Table.Cell>Physics</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>09:00</Table.Cell>
            <Table.Cell>Italian</Table.Cell>
            <Table.Cell>Italian</Table.Cell>
            <Table.Cell>Italian</Table.Cell>
            <Table.Cell>History</Table.Cell>
            <Table.Cell>Gym</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>10:00</Table.Cell>
            <Table.Cell>Art</Table.Cell>
            <Table.Cell>English</Table.Cell>
            <Table.Cell>English</Table.Cell>
            <Table.Cell>Math</Table.Cell>
            <Table.Cell>Latin</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>11:00</Table.Cell>
            <Table.Cell>Latin</Table.Cell>
            <Table.Cell>Gym</Table.Cell>
            <Table.Cell>Science</Table.Cell>
            <Table.Cell>Math</Table.Cell>
            <Table.Cell>Science</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>12:00</Table.Cell>
            <Table.Cell>Latin</Table.Cell>
            <Table.Cell>Math</Table.Cell>
            <Table.Cell>Latin</Table.Cell>
            <Table.Cell>Religion</Table.Cell>
            <Table.Cell>Math</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>13:00</Table.Cell>
            <Table.Cell>-</Table.Cell>
            <Table.Cell>Physics</Table.Cell>
            <Table.Cell>-</Table.Cell>
            <Table.Cell>-</Table.Cell>
            <Table.Cell>Art</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      }
      <div className="files">
      {this.state.file && 
      <FilePreview 
        type={mime.getExtension(this.state.file.type)} 
        name={this.state.file.name} 
        onRemove={this.onAttachmentRemove}
      />}      
      </div>
      <div>
        {!this.state.file &&
        <TimetableUpload onDrop={this.onDrop} /> 
        }        
      </div>
      </Modal.Content>
      </Modal>
    )
  }
}

export default TimetableAdd
