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

export class TeacherGrade extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
          gradeList:[],
          subjectID:null
        }
       
    }

    async componentDidMount(){
        const {params} = this.props.match;
        this.setState({
            subjectID: this.props.match.params.subjectID
        })
        const response = await api.teacher.getTeacherGrades(1, params.subjectID);
        if (response) {
           this.setState({gradeList:response.data})
          } 
      }
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
          Grades of Class 1 ,Subject {this.state.subjectID}
        </h3>
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
           {this.state.gradeList.map((mark) =>
             <Table.Row>
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
     <Container className="contentContainer">
       <h3 className="contentHeader"> 
         <Icon name='braille' /> 
         Grades of Class 1 ,Subject {this.state.subjectID} </h3>
       <NoData/>
     </Container>
   );
}
}