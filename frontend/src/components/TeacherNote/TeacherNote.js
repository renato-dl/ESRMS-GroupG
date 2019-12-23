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
// import './TeacherNote.scss';
import Tooltip from '../Tooltip/Tooltip';

export class TeacherNote extends React.Component{
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
    render(){
      return (
        <Container className="Grades-container contentContainer">
        <h3 className="contentHeader">
          <Icon name='braille'/>
          Note operation
        </h3>
       </Container>
     )};
      }