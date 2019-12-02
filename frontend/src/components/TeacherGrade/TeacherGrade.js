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
import GradeDetail from './GradeDetail/GradeDetail';
import GradeUpdate from './GradeDetail/GradeUpdate';
import GradeDelete from './GradeDetail/GradeDelete';
import './TeacherGrade.scss';

export class TeacherGrade extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
          gradeList:[],
          subjectID:null,
          subjectName:null, 
          classId: null, 
          addMarksOpen: false,
          modifyGradeOpen: false, 
          deleteGradeOpen: false,
          selectedGrade: null
        }
    }

    async componentDidMount(){
        const sName = this.props.match.params.subjectName;
        const sId = this.props.match.params.subjectID;
        const cId = this.props.match.params.classID;
        this.setState({
            subjectName: sName,
            subjectID: sId,
            classId: cId
        })
        this.fetchGrades(); 
      }

    fetchGrades = async () =>{     
      const cId = this.props.match.params.classID;
      const sId = this.props.match.params.subjectID;
      try{
        const response = await api.teacher.getTeacherGrades(cId, sId);
        if (response) {
            this.setState({gradeList:response.data});
        }  
      }
      catch(e){
        //
      }           
    }

    // Open modal for adding new marks
    addNewMarks = () => {
      this.setState({addMarksOpen: true});
    };

    onGradeDetailClose = () => {
      this.setState({addMarksOpen: false});
    };

    // open modal for deleting grade
    deleteGrade = (grade) =>{
      this.setState({deleteGradeOpen: true, selectedGrade: grade});
    }
    onDeleteGradeClose = () =>{
      this.setState({deleteGradeOpen: false, selectedGrade: null});
    }

    // open modal for updating grade
    updateGrade = (grade) =>{
      this.setState({modifyGradeOpen: true, selectedGrade: grade});
    }

    onUpdateGradeClose = () =>{
      this.setState({modifyGradeOpen: false, selectedGrade: null});
    }

    styleMarkColor(mark) {
      if(mark<6){
        return({backgroundColor: "#F8D2D3"});
      }
        return({backgroundColor: "#C6EDBA"});
    };
    render() {
        console.log(this.state.gradeList);
        if (this.state.gradeList.length) {
          return (
            <Container className="Grades-container contentContainer">
            <h3 className="contentHeader">
              <Icon name='braille'/>
              Grades of Class 1, Subject {this.state.subjectName}
            </h3>
            <Button className="ui vk button" onClick={this.addNewMarks}>
                <i className="plus icon"></i>
                Add Grades
            </Button>
            {this.state.addMarksOpen &&
                <GradeDetail
                  subjectId={this.state.subjectID}
                  classId={this.state.classId}
                  onClose={this.onGradeDetailClose}
                  onSave={() =>{
                    this.fetchGrades();
                    this.onGradeDetailClose();
                  }}
                />
              }
            <Table className='Marks_table' columns={6}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>FirstName</Table.HeaderCell>
                    <Table.HeaderCell>LastName</Table.HeaderCell>
                    <Table.HeaderCell>Mark</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
              <Table.Body>
              {this.state.gradeList.map((mark, index) =>
                <Table.Row key={index}>
                    <Table.Cell>{ mark.FirstName } </Table.Cell>
                    <Table.Cell>{ mark.LastName } </Table.Cell>
                    <Table.Cell><span className="markField" style={this.styleMarkColor(mark.Grade)}>{ mark.Grade }</span></Table.Cell>
                    <Table.Cell>{ mark.Type } </Table.Cell>
                    <Table.Cell>{ moment(mark.GradeDate).format('LL')}</Table.Cell>
                    <Table.Cell>
                      <Icon name="edit" onClick={() => this.updateGrade(mark)}/> Edit
                        <br/>
                        <Icon name="delete" onClick={() =>this.deleteGrade(mark)}/> Delete
                    </Table.Cell>
                </Table.Row>
              )} 
              </Table.Body>
              </Table>
              {this.state.modifyGradeOpen &&
                <GradeUpdate
                  subjectId={this.state.subjectID}
                  classId={this.state.classId}
                  grade={this.state.selectedGrade}
                  onClose={this.onUpdateGradeClose}
                  onSave={() =>{
                    this.fetchGrades();
                    this.onUpdateGradeClose();
                  }}
                />
              }
              {this.state.deleteGradeOpen &&
                <GradeDelete
                  subjectId={this.state.subjectID}
                  classId={this.state.classId}
                  grade={this.state.selectedGrade}
                  onClose={this.onDeleteGradeClose}
                  onSave={() =>{
                    this.fetchGrades();
                    this.onDeleteGradeClose();
                  }}
                />
              }

          </Container>
        );
      }

   return (
     <Container className="Grades-container contentContainer">       
       <h3 className="contentHeader">
          <Icon name='braille'/>
          Grades of Class 1, Subject {this.state.subjectName}
        </h3>
         <Button className="ui vk button" onClick={this.addNewMarks}>
            <i className="plus icon"></i>
            Add Grades
        </Button>
        {this.state.addMarksOpen &&
            <GradeDetail
              subjectId={this.state.subjectID}
              classId={this.state.classId}
              onClose={this.onGradeDetailClose}
              onSave={() =>{
                this.fetchGrades();
                this.onGradeDetailClose();
              }}
            />
          }
       <NoData/>
     </Container>
   );
  } 
}