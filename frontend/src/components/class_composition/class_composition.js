import React from 'react';
import { api } from '../../services/api';
import {Table, Icon, Container, Button} from 'semantic-ui-react';
import ClassCompositionDetail from './ClassCompositionDetail/ClassCompositionDetail';
import { NoData } from '../NoData/NoData';

export class Class_composition extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      Class_composition:[], 
      classId: null, 
      className: null, 
      enrolledStudents: [],
      isStudentsOpen: false
  }
}
  async componentDidMount(){
    const response = await api.admin.getClasslist();
    if (response) {
       console.log(response)
       this.setState({Class_composition:response.data})
      } 
  }

  selectMarks = async (studentID) => {
  };

  onClassDetailClose = () => {
    this.setState({classId: null, className: null, isStudentsOpen: false});
  };

  render(){
    if(this.state.Class_composition.length){
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
           <Table.HeaderCell>Class_Name</Table.HeaderCell>
           <Table.HeaderCell>CreationYear</Table.HeaderCell>
           <Table.HeaderCell>CoordinatorName</Table.HeaderCell>
           <Table.HeaderCell>View_in_Details</Table.HeaderCell>           
       </Table.Row>
   </Table.Header>
     <Table.Body>
     {this.state.Class_composition.map((data, index) =>
       <Table.Row key={index}>
           <Table.Cell>{ data.ID } { data.Name } </Table.Cell>
           <Table.Cell>{data.CreationYear}</Table.Cell>
           <Table.Cell>{data.CoordinatorName}</Table.Cell>
           <Table.Cell>
             <Button color='blue' type='button'>Details</Button>
             <Button color='blue' type='button' onClick={() =>{
             this.setState({classId: data.ID});
             this.setState({className: data.Name});
             this.setState({isStudentsOpen: true});
            }}>Add Students</Button>
             </Table.Cell>
       </Table.Row>
     )} 
     </Table.Body>
     </Table>
     {this.state.isStudentsOpen &&
            <ClassCompositionDetail
              classId= {this.state.classId}
              className= {this.state.className}
              onClose={this.onClassDetailClose}
              onSave={() => {
                this.onClassDetailClose();
              }}
            />
          }
 </Container>)
      }
      return (
        <Container className="contentContainer">
          <h3 className="contentHeader"> 
            <Icon name='braille' /> 
            Class Composition</h3>
          <NoData/>
        </Container>
      );
   }
  }
