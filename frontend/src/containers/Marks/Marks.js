import React from 'react';
import { api } from '../../services/api';
import './Marks.scss';

import { Header, Icon} from 'semantic-ui-react';

export class Marks extends React.Component{
    constructor(props)
    {
      super(props)
      this.state={
      Marks:[
        {subject:"subj1",marks:"100"},
        {subject:"subj2",marks:"90"},
        {subject:"subj3",marks:"80"}
      ]
      }
    }
    // async componentDidMount(){
    //     const responce=await api.marks.getMarks(1);
    //     if(responce){
    //         this.setState({Marks:responce.data})
    //     }
    // }

    // selectMarks=async(studentID)=>{
    //     console.log(studentID);
    //     this.props.history.push('/marks')
    // }
      render(){
        return (
            <div className="Marks-container">
              <h3 className="contentHeader"> 
        <Icon name='sort numeric up' /> Grades of Nume Surname 2019-2020</h3>
            <h2 className="title">Student{this.props.match.params.studentID}'s score:</h2>
            {this.state.Marks.map(mark=>
            <p>
              subject:{mark.subject},
              marks:{mark.marks}
            </p>
              )}
            </div>
        )
    }
    }