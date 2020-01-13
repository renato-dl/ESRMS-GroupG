import React, { Component } from 'react'
import {FileUpload} from '../../FileUpload/FileUpload';
import {FilePreview} from '../../FilePreview/FilePreview';
import {Table, Icon, Modal, Button, Accordion } from 'semantic-ui-react';
import {api} from '../../../services/api';
import mime from 'mime';
import XLSX from 'xlsx';
import * as toastr from 'toastr';
import moment from 'moment';
export class TimetableAdd extends Component {
  dayOfTheWeek = {"Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5}
  dayOfTheWeekById = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri"}
  state = {
    file: null, 
    classTimetable: null, 
    errorPresent: false,
    headerRow: ["Hour", "Mon", "Tue", "Wed", "Thu", "Fri"],
    activeIndex: -1, 
    allowedSubjects: [], 
    timetable: [], 
    previousTimetable: null, 
    isPreviousPresent: false, 
    acceptedExtensions: [mime.getType('xlsx')], 
    excelErrorMessage: 'is not valid. Please upload a [.xlsx] file under 5MB.'
  };

  async componentDidMount(){
    const subjects  = await api.admin.getSubjectslist();    
    if(subjects && subjects.data){
      this.setState({allowedSubjects: [...subjects.data, {ID: -1, Name: '-'}]});
    }
    if(this.props.timetable && this.props.timetable.length > 0){
      // console.log(this.props.timetable)
      this.setState({isPreviousPresent: true});
      this.mapSavedTimetable(this.props.timetable);
    }
    //console.log(this.state.allowedSubjects);
  }

  mapSavedTimetable(prevTimetable){
      const timeDict = {}
      for(let i = 0; i < prevTimetable.length; i++){
        const elem = prevTimetable[i];
        let hourDict = timeDict[elem.Hour];
        if(!hourDict){
          hourDict = {};
        }
        const day = this.dayOfTheWeekById[elem.Day];
        hourDict[day] = this.getSubjectNameById(elem.SubjectID);
        timeDict[elem.Hour] = hourDict;
      }
      // console.log(timeDict);
      const dataForTable = [];
      let rowIndex = 1;
      let elemIndex = 0;
      for(let keyD in timeDict){
        const dataRow = [];
        const hourFormat = moment().hour(keyD).minute(0).format('HH:mm');
        const cellHour = {key: `col-${rowIndex}-Hour-${hourFormat}`, content: hourFormat, error: false};
        dataRow.push(cellHour);
        elemIndex = elemIndex + 1;
        for(let j = 1; j < this.state.headerRow.length; j ++){
          const head = this.state.headerRow[j];
          const elem = timeDict[keyD][head];
          const cell = {key: `col-${rowIndex}-${head}-${elem}`, content: elem, error: false};
          dataRow.push(cell);
          elemIndex = elemIndex + 1;
        }
        dataForTable.push(dataRow);
        rowIndex = rowIndex + 1;
        elemIndex = 0;
      }
      //console.log(dataForTable);
      this.setState({previousTimetable: dataForTable});
  }

  onDrop = (files, event) => {
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
        const timetableData = this.CreateTimetable(dataParse);
        this.setState({classTimetable: timetableData});
        this.checkErrorsPresence(dataParse);
      }catch(ex){
        console.log(ex);
      }
    }
    reader.readAsArrayBuffer(file)
  }

  checkSubjectCorrectness(subject){
    const subjects = this.state.allowedSubjects;
    let found = false;
    const error = this.checkErrorAbsence(subject);
    subjects.forEach(function(elem){      
      if(subject == elem.Name){
        found = true;
      }        
    });
    if (error && found)
      return true;
    else   
      return false;
  }

  checkErrorAbsence(elem){
    let result = true;
    if(elem == 'ERROR')
      result = false;
    return result;
  }

  getSubjectId(subject){
    let subjectId = -1;
    const subjects = this.state.allowedSubjects;
    subjects.forEach(function(elem){
      if(subject == elem.Name){
        subjectId = elem.ID;
      }
    });
    return subjectId;
  }

  getSubjectNameById(subjectId){
    let subjectName = "None";
    const subjects = this.state.allowedSubjects;
    subjects.forEach(function(elem){
      if(subjectId === elem.ID){
        subjectName = elem.Name;
      }
    });
    return subjectName;
  }

  CreateTimetable(data){
    let timetable = [];
    let timetableToSave = [];
    if (data){
      const header = this.state.headerRow;
      for(let i = 1; i < data.length; i++){
        const row = data[i];
        const tableRow = [];
        if(header){
          let hourToSave;
          for(let j = 0; j < header.length; j ++){
            const elem = header[j];
            let cellError = false;
            if(elem  == "Hour"){
              hourToSave = row[elem];
              cellError = this.checkErrorAbsence(row[elem]) ? false : true;
            }
            else{
              cellError = this.checkSubjectCorrectness(row[elem]) ? false : true;
              const subjId = this.getSubjectId(row[elem]);
              if(subjId !== -1){
                const elemToSave = {
                  subjectId: subjId, 
                  hour: hourToSave, 
                  day: this.dayOfTheWeek[elem]
                };
                timetableToSave.push(elemToSave);
              }              
            }          

            const cell = {key: `col-${i}-${elem}-${row[elem]}`, 
            content: row[elem], 
            error: cellError};
            tableRow.push(cell);            
          }
        }
        timetable.push(tableRow);
      }
    }
    this.setState({timetable: timetableToSave});
    return timetable;    
  }

  checkErrorsPresence(timetable){
    if(timetable){
      let incorrectContent = false;
      for(let i = 1; i < timetable.length; i++){
        const data = timetable[i];
        if(!this.checkErrorAbsence(data["Hour"]) ||
        !this.checkSubjectCorrectness(data["Mon"]) || !this.checkSubjectCorrectness( data["Tue"]) || 
        !this.checkSubjectCorrectness(data["Wed"]) || !this.checkSubjectCorrectness(data["Thu"]) || 
        !this.checkSubjectCorrectness(data["Fri"]) ){
          this.setState({errorPresent: true});
          incorrectContent = true;
        }
      }
      if(incorrectContent){
        toastr.error("Incorrect timetable data!");
      }
      if(timetable.length <= 0){
        this.setState({errorPresent: true});
        toastr.error("Timetable empty!");
      }
    }
    else{
      this.setState({errorPresent: true});
      toastr.error("Timetable empty!");
    }       
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  onTimetableRemove = async (name) => {
    try{
      const result = await api.admin.deleteClassTimetable(this.props.class.ID);
      if(result && result.data && result.data.success){
        // console.log(result);
        toastr.success('Timetable deleted!');
        this.setState({ prevTimetable: null, classTimetable: null});
      }
    }
    catch(err){
      console.log(err);
      toastr.error(err);
    }    
    this.props.onClose(); 
  };

  onFileRemove = (name) => {
    this.setState({ file: null, classTimetable: null, errorPresent: false});
  };

  renderBodyRow(data, index){
    //console.log(data);
    return {key: index || `row-${index}`, cells: [...data]}
  }

  onSave = async () =>{
    const timetable = this.state.timetable;
    const request = {
      classId: this.props.class.ID,
      timetable: timetable
    }
    try{
      const result = await api.admin.addClassTimetable(request);
      // console.log(result);
      if (result && result.data && result.data.success)
        toastr.success('Timetable saved!');
    }
    catch(err){
      console.log(err);
      toastr.error(err);
    }           
    this.props.onClose(); 
  }

  render() {
    return (
      <Modal dimmer open className="class-composition-detail" size="small">
      <Modal.Header>
        <span>Class {this.props.class ? this.props.class.Name : ''} timetable</span>
        <Icon onClick={this.props.onClose} className="close-icn" name="close" />
      </Modal.Header>
      <Modal.Content>
      {!this.state.isPreviousPresent && 
      <Accordion fluid styled>
        <Accordion.Title 
          active={this.state.activeIndex === 0}
          index={0}
          onClick={this.handleClick}>
          <Icon name='dropdown' />
          Example of Excel file
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndex === 0}>
        <Table columns='6'>
          <Table.Header>
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
        </Accordion.Content>
      </Accordion>       
      }   
      {!this.state.classTimetable && !this.state.previousTimetable &&
      <br />}
      {this.props.timetable &&
        <Table
          headerRow={this.state.headerRow}
          tableData={this.state.previousTimetable}
          renderBodyRow={this.renderBodyRow}
          >
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
        onRemove={this.onFileRemove}
      />}      
      </div>
      <div>
      {(!this.state.file && !this.state.previousTimetable) &&
        <FileUpload onDropAccepted={this.onDrop} 
        accept={this.state.acceptedExtensions}
        errorMessage={this.state.excelErrorMessage}/> 
        }        
      </div>
      </Modal.Content>
      {!this.state.previousTimetable && 
      <Modal.Actions>
        <Button color='green'  onClick={this.onSave} disabled={!this.state.classTimetable || this.state.errorPresent}>
          <Icon name='checkmark'  /> Save
        </Button>
      </Modal.Actions>
      }
      {this.state.previousTimetable &&
      <Modal.Actions>
        <Button color='red'  onClick={this.onTimetableRemove}>
          <Icon name='delete'  /> Delete
        </Button>
      </Modal.Actions>
      }
      </Modal>
    )
  }
}

export default TimetableAdd
