import React from 'react';
import { api } from '../../services/api';
import {
  Table,
  Button,
  Icon,
  Container
} from 'semantic-ui-react'
import moment from 'moment';
import { NoData } from '../NoData/NoData';
import './TeacherNote.scss';
import Tooltip from '../Tooltip/Tooltip';
import NoteDetail from './NoteDetail/NoteDetail';
import NoteDetele from './NoteDetail/NoteDetele';

export class TeacherNote extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
          noteList:[],
          studentID:null,
          classId: null, 
          addNoteOpen: false,
          modifyNoteOpen: false, 
          deleteNoteOpen: false,
          selectedNote: null
        }
    }

    async componentDidMount(){
        const cId = this.props.match.params.ClassId;
        this.setState({
            classId: cId
        })
        this.fetchNotes(); 
      }

      fetchNotes = async () =>{    
        const response = await api.teacher.getNotes(this.props.match.params.ClassId);
        if (response) {
          console.log(response)
            this.setState({noteList:response.data});
        }  }

    // Open modal for adding new marks
    addNewNote = () => {
      this.setState({addNoteOpen: true});
    };

    onNoteDetailClose = () => {
      this.setState({addNoteOpen: false});
    };

    // open modal for deleting note
    deleteNote = (note) =>{
      this.setState({deleteNoteOpen: true, selectedNote: note});
    }
    onDeleteNoteClose = () =>{
      this.setState({deleteNoteOpen: false, selectedNote: null});
    }

    // open modal for updating note
    updateNote = (note) =>{
      this.setState({modifyNoteOpen: true, selectedNote: note});
    }

    onUpdateNoteClose = () =>{
      this.setState({modifyNoteOpen: false, selectedNote: null});
    }

    styleNoteColor(IsSeen) {
      if(IsSeen==0){
        return({color: "#000000"});
      }
        return({color: "#C0C0C0"});
    };
    render(){
      if(this.state.noteList.length){
         return ( 
        <Container className="Notes-container contentContainer">
        <h3 className="contentHeader">
          <Icon name='bullhorn'/>
          Note Operation
        </h3>
        <Button className="ui vk button" onClick={this.addNewNote}>
            <i className="plus icon"></i>
            Add Note
        </Button>
        {this.state.addNoteOpen &&
            <NoteDetail
              classId={this.state.classId}
              onClose={this.onNoteDetailClose}
              onSave={() =>{
                this.fetchNotes();
                this.onNoteDetailClose();
              }}
            />
          }
        <Table class='Notes_table'>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell textAlign="center">#</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Name</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Title</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center" >Description</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Date</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Is Seen</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Action</Table.HeaderCell> 
              </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.noteList.map((note,index) =>
              <Table.Row key = {index}>
                  <Table.Cell textAlign="center"> <span  style={this.styleNoteColor(note.IsSeen)}>{index+1 }  </span></Table.Cell>
                  <Table.Cell textAlign="left"> <span  style={this.styleNoteColor(note.IsSeen)}>{ note.FirstName } { note.LastName }  </span> </Table.Cell> 
                  <Table.Cell textAlign="left"> <span  style={this.styleNoteColor(note.IsSeen)}>{ note.Title } </span></Table.Cell>
                  <Table.Cell textAlign="left" width={6}> <span  style={this.styleNoteColor(note.IsSeen)}>{ note.Description } </span></Table.Cell>
                  <Table.Cell textAlign="left"> <span   style={this.styleNoteColor(note.IsSeen)}>{ moment(note.Date).format('LL')} </span></Table.Cell>
                  <Table.Cell textAlign="left"> <span  style={this.styleNoteColor(note.IsSeen)}>{ note.IsSeen?'Yes':'No'}  </span></Table.Cell>
                  <Table.Cell textAlign="left" className="edit-cell"> 
                  <span  style={this.styleNoteColor(note.IsSeen)}>
                  <Tooltip 
                    text="Edit note"
                    trigger={
                      <Icon name="edit" onClick={() => this.updateNote(note)} />
                    }
                  />
                  <Tooltip  
                    text="Delete note"
                    trigger={
                      <Icon name="delete" onClick={() =>this.deleteNote(note)} />
                    }
                  />
                  </span>
                </Table.Cell>
              </Table.Row>
            )} 
           </Table.Body>
          </Table>
          {this.state.modifyNoteOpen &&
            <NoteDetail
              classId={this.state.classId}
              note={this.state.selectedNote}
              onClose={this.onUpdateNoteClose}
              onSave={() =>{
                this.fetchNotes();
                this.onUpdateNoteClose();
              }}
            />
          }
          {this.state.deleteNoteOpen &&
            <NoteDetele
              classId={this.state.classId}
              note={this.state.selectedNote}
              onClose={this.onDeleteNoteClose}
              onSave={() =>{
                this.fetchNotes();
                this.onDeleteNoteClose();
              }}
            />
          }
       </Container>
     );}
      return ( 
        <Container className="Notes-container contentContainer">
        <h3 className="contentHeader">
          <Icon name='braille'/>
          Note Operation
        </h3>
        <Button className="ui vk button" onClick={this.addNewNote}>
            <i className="plus icon"></i>
            Add Note
        </Button> 
        <NoData/>
        {this.state.addNoteOpen &&
            <NoteDetail
              classId={this.state.classId}
              onClose={this.onNoteDetailClose}
              onSave={() =>{
                this.fetchNotes();
                this.onNoteDetailClose();
              }}
            />
          }
            </Container>
        ); 
    } 
    }