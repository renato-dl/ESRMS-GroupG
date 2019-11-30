import React from 'react';
//import { api } from '../../services/api';
import {Table, Icon, Container} from 'semantic-ui-react';
//import { NoData } from '../NoData/NoData';

export class Class_composition extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // marks: [],
      // studentName: ''
      Class_composition:[
      {ID:1,Creation_Year:9,Name:'A',CoordinatorName:'c1'},
      {ID:2,Creation_Year:9,Name:'B',CoordinatorName:'c2'},
      {ID:3,Creation_Year:9,Name:'C',CoordinatorName:'c3'}
      ]
  }
}
  async componentDidMount(){
  }

  selectMarks = async (studentID) => {
  };


  render(){
   return ( 
   <Container className="contentContainer">
   <h3 className="contentHeader"> 
     <Icon name='braille'/> 
     Class Composition
   </h3>
   {/* <h2 className="title">Student {this.props.match.params.studentID}'s score:</h2> */}
   <Table columns={4}>
   <Table.Header>
       <Table.Row>
           <Table.HeaderCell>ID</Table.HeaderCell>
           <Table.HeaderCell>Name</Table.HeaderCell>
           <Table.HeaderCell>CoordinatorName</Table.HeaderCell>
           <Table.HeaderCell>View_in_Details</Table.HeaderCell>           
       </Table.Row>
   </Table.Header>
     <Table.Body>
     {this.state.Class_composition.map((data) =>
       <Table.Row>
           <Table.Cell>{ data.ID } </Table.Cell>
           <Table.Cell>{ data.Name } </Table.Cell>
           <Table.Cell>{data.CoordinatorName}</Table.Cell>
           <Table.Cell><button type='button'>details</button></Table.Cell>
       </Table.Row>
     )} 
     </Table.Body>
     </Table>
 </Container>

   )
  }
}
