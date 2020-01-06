import React, { Component } from 'react'
import {TimetableUpload} from '../../FileUpload/TimetableUpload';
import {FilePreview} from '../../FilePreview/FilePreview';
import {Table, Icon, Modal } from 'semantic-ui-react';
import mime from 'mime';
import XLSX from 'xlsx';

export class TimetableAdd extends Component {
  state = {
    file: null, 
    classTimetable: null, 
    headerRow: ["Hour", "Mon", "Tue", "Wed", "Thu", "Fri"]
  };

  onDrop = (files) => {
    const reader = new FileReader()
    const file = files[0];
    this.setState({file: file});
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onloadend = () => {
    // Do whatever you want with the file contents
      const binaryStr = reader.result      
      try{
        let readedData = XLSX.read(binaryStr, {type: 'buffer'});
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];
        /* Convert array to json*/
        const headerArray = this.state.headerRow;
        const dataParse = XLSX.utils.sheet_to_json(ws, 
          {header: headerArray, defval: 'ERROR',
          dateNF: 'hh:mm', raw: false});
        this.setState({classTimetable: dataParse});
      }catch(ex){
        console.log(ex);
      }
    }
    reader.readAsArrayBuffer(file)
  }

  onAttachmentRemove = (name) => {
    this.setState({ file: null, classTimetable: null});
  };

  renderBodyRow(data, index){
    if(index !== 0)
      return {key: index || `row-${index}`,
      cells: [ 
        "Hour" ? {key: `col-${index}-hour-${data["Hour"]}`, content: data["Hour"], error: (data["Hour"].match("ERROR") ? true : false)} : 'None', 
        "Mon" ? {key: `col-${index}-mon-${data["Mon"]}`, content: data["Mon"], error: (data["Mon"].match("ERROR") ? true : false)} : 'None', 
        "Tue" ? {key: `col-${index}-tue-${data["Tue"]}`, content: data["Tue"], error: (data["Tue"].match("ERROR") ? true : false)} : 'None', 
        "Wed" ? {key: `col-${index}-wed-${data["Wed"]}`, content: data["Wed"], error: (data["Wed"].match("ERROR") ? true : false)} : 'None', 
        "Thu" ? {key: `col-${index}-thu-${data["Thu"]}`, content: data["Thu"], error: (data["Thu"].match("ERROR") ? true : false)} : 'None', 
        "Fri" ? {key: `col-${index}-fri-${data["Fri"]}`, content: data["Fri"], error: (data["Fri"].match("ERROR") ? true : false)} : 'None'
      ],}
  }

  render() {
    return (
      <Modal dimmer open className="class-composition-detail" size="small">
      <Modal.Header>
        <span>Class {this.props.class ? this.props.class.Name : ''} timetable</span>
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
      {this.state.classTimetable && 
      <Table 
        headerRow={this.state.headerRow}
        tableData={this.state.classTimetable}
        renderBodyRow={this.renderBodyRow}>
      </Table>}
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
