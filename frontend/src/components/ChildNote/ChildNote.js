import React from 'react';
import { api } from '../../services/api';
// import './Marks.scss';
import {Table, Icon, Container, Dropdown } from 'semantic-ui-react';

import moment from 'moment';
import { NoData } from '../NoData/NoData';

import ChildNoteDetail from './ChildNoteDetail';
import Tooltip from '../Tooltip/Tooltip';
import {ApplicationStoreContext} from '../../store';

export class ChildNote extends React.Component{
  static contextType = ApplicationStoreContext;
  constructor(props) {
    super(props);
    this.state = {
      noteList:[],
      Title: '',
      Date: null,
      Name: '', 
      IsSeen: null,
      detailNoteOpen:false
    }
  }

  fetchNotes = async () =>{ 
    const student = this.context.state.parent.selectedStudent.ID;   
    const request={
        studentId:this.props.match.params.studentID
    }
    const response = await api.parent.getChildNotes(request);
    if (response) {
      console.log(response)
        this.setState({noteList:response.data});
    }  
  }
    
  async componentDidMount(){
    const student = JSON.parse(localStorage.getItem('selectedChild'));
    this.fetchNotes()
  }

//   selectMarks = async (studentID) => {
//     console.log(studentID);
//     this.props.history.push('/marks')
//   };

  onSelect = (event, {value}) => {
    this.setState({selectedSubj: value});
    if (value != '' && value != 'all'){
      let selectedMarks = [];
      this.state.allMarks.forEach(function(e){
        if(e.Name == value)
          selectedMarks.push(e);
      });
      this.setState({marks: selectedMarks});
    }
    else{
      const allMarks = this.state.allMarks;
      this.setState({marks: allMarks});
    }  
  }
  
  styleNoteColor(IsSeen) {
    if(IsSeen==0){
      return({color: "#000000"});
    }
      return({color: "#C0C0C0"});
  };

  onDetailNoteClose = () =>{
    this.setState({detailNoteOpen: false, selectedNote: null});
    this.fetchNotes()
  }

  showNote = (note) =>{
    this.setState({detailNoteOpen: true, selectedNote: note});
  }
  render(){
    if(this.state.noteList.length){
      return (
        <Container className="Notes-container contentContainer">
        <h3 className="contentHeader">
          <Icon name='bullhorn'/>
          {this.context.state.parent ? this.context.state.parent.selectedStudent.FirstName + "'s" : 'Student'} notes
       </h3>
        <Table className='Notes_table'>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell textAlign="center">#</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Title</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Date</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Is Seen</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Name</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Detail</Table.HeaderCell> 
              </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.noteList.map((note,index) =>
              <Table.Row key = {index}>
                  <Table.Cell textAlign="center"> <span className="markField" style={this.styleNoteColor(note.IsSeen)}>{index+1 }  </span></Table.Cell>
                  <Table.Cell textAlign="center"> <span className="markField" style={this.styleNoteColor(note.IsSeen)}>{ note.Title } </span></Table.Cell>
                  <Table.Cell textAlign="center"> <span className="markField" style={this.styleNoteColor(note.IsSeen)}>{ moment(note.Date).format('LL')} </span></Table.Cell>
                  <Table.Cell textAlign="center"> <span className="markField" style={this.styleNoteColor(note.IsSeen)}>{ note.IsSeen?'Yes':'No'}  </span></Table.Cell>
                  <Table.Cell textAlign="center"> <span className="markField" style={this.styleNoteColor(note.IsSeen)}>{ note.FirstName } { note.LastName }  </span> </Table.Cell> 
                  <Table.Cell textAlign="center" className="edit-cell"> 
                  <Tooltip 
                    text="note"
                    trigger={
                      <Icon name="edit" onClick={() => this.showNote(note)} />
                    }
                  />
                </Table.Cell>
              </Table.Row>
            )} 
           </Table.Body>
          </Table>
          {this.state.detailNoteOpen &&
            <ChildNoteDetail
              classId={this.state.classId}
              note={this.state.selectedNote}
              onClose={this.onDetailNoteClose}
              onSave={() =>{
                this.fetchNotes();
                this.onDetaileNoteClose();
              }}
            />
          }
       </Container>)
    }
    return (
      <Container className="contentContainer">
        <h3 className="contentHeader"> 
          <Icon name='braille' /> 
          {this.context.state.parent ? this.context.state.parent.selectedStudent.FirstName + "'s" : 'Student'} notes
        </h3>
        <NoData/>
      </Container>
    );
  }
}
