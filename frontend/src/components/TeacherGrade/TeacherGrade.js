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
import './TeacherGrade.scss';

export class TeacherGrade extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
          gradeList:[],
          subjectID:null,
          subjectName:null, 
          classId: null, 
          addMarksOpen: false
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
      const response = await api.teacher.getTeacherGrades(cId, sId);
      if (response) {
          this.setState({gradeList:response.data});
      }       
    }

    // Open modal for adding new marks
    addNewMarks = () => {
      this.setState({addMarksOpen: true});
    };

    onGradeDetailClose = () => {
      this.setState({addMarksOpen: false});
    };

    styleMarkColor(mark) {
      if(mark<6){
        return({backgroundColor: "#F8D2D3"});
      }
        return({backgroundColor: "#C6EDBA"});
    };
    render(){
        if(this.state.gradeList.length){
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
         <Table className='Marks_table' columns={5}>
         <Table.Header>
             <Table.Row>
                 <Table.HeaderCell>FirstName</Table.HeaderCell>
                 <Table.HeaderCell>LastName</Table.HeaderCell>
                 <Table.HeaderCell>Mark</Table.HeaderCell>
                 <Table.HeaderCell>Type</Table.HeaderCell>
                 <Table.HeaderCell>Date</Table.HeaderCell>
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
             </Table.Row>
           )} 
           </Table.Body>
           </Table>
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