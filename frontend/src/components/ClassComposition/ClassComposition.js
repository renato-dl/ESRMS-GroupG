import React from 'react';
import { api } from '../../services/api';
import {Table, Icon, Container, Button} from 'semantic-ui-react';
import ClassCompositionDetail from './ClassCompositionDetail/ClassCompositionDetail';
import { NoData } from '../NoData/NoData';
import './ClassComposition.scss';
import {ClassDelete} from './ClassDelete';
import AddNewClass from './AddNewClass';
import * as toastr from 'toastr';

export class ClassComposition extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      Class_composition:[], 
      classId: null, 
      className: null, 
      enrolledStudents: [],
      isStudentsOpen: false, 
      deleteClassModalOpen: false,
      deleteClassData: null, 
      addClassModalOpen: false
    }
  }
  async componentDidMount(){
    this.fetchClasses();
  }

  async fetchClasses(){
    const response = await api.admin.getClasslist();
    if (response) {
      //console.log(response)
      this.setState({Class_composition:response.data})
    } 
  }

  selectMarks = async (studentID) => {
  };

  onClassDetailClose = () => {
    this.setState({classId: null, className: null, isStudentsOpen: false, deleteClassModalOpen: false});
  };

  addClass = () => {
    this.setState({addClassModalOpen: true});
  }  

  onAddClassClose = () => {
    this.setState({addClassModalOpen: false});
  }

  deleteClass = (data) => {
    this.setState({ deleteClassData: data, deleteClassModalOpen: true });
  } 
  
  onDeleteClass = async() => {
    const request = {
      id: this.state.deleteClassData.ID
    }
    try{
      const response = await api.admin.deleteClass(request);   

      if (response.data.success) {
          await this.fetchClasses();
          toastr.success('Class removed successfully!');
      } else {
          toastr.error(response.data.msg);
      }
    }
    catch(e){
      toastr.error(e);
    }    
    this.setState({ deleteClassData: null, deleteClassModalOpen: false })
  }

  render() {
    if(this.state.Class_composition.length) {
      return (
        <Container className="class-composition contentContainer">
          <h3 className="contentHeader"> 
            <Icon name='linode'/> 
            Class Composition
          </h3>
          <Button color='blue' onClick={this.addClass}>
            Add class
          <Icon className="plus icon" name="plus"/>  
          </Button>
          <Table columns={4}>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>Class Name</Table.HeaderCell>
                  {/* <Table.HeaderCell>CreationYear</Table.HeaderCell> */}
                  <Table.HeaderCell>Coordinator Name</Table.HeaderCell>
                  <Table.HeaderCell>Details</Table.HeaderCell>           
              </Table.Row>
          </Table.Header>
            <Table.Body>
            {this.state.Class_composition.map((data, index) =>
              <Table.Row key={index}>
                  <Table.Cell>{ data.Name } </Table.Cell>
                  {/* <Table.Cell>{data.CreationYear}</Table.Cell> */}
                  <Table.Cell>{data.Coordinator}</Table.Cell>
                  <Table.Cell>
                    <Button color='blue' type='button' onClick={() =>{
                        this.setState({
                        classId: data.ID,
                        className: data.Name,
                        isStudentsOpen: true
                      });
                    }}>Students 
                    <Icon className="cog icon" name="cog"/>            
                    </Button>
                    <Button color='red' onClick={() =>this.deleteClass(data)}>
                      Delete
                    <Icon className="delete icon" name="delete"/>  
                    </Button>
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
            {this.state.deleteClassModalOpen &&
              <ClassDelete
                class={this.state.deleteClassData}
                onClose={this.onClassDetailClose}
                onDelete={this.onDeleteClass}
              />
            }
            {this.state.addClassModalOpen &&
            <AddNewClass
              onClose={this.onAddClassClose}
              onSave={() =>{
                this.fetchClasses();
              }}
            />
            }
        </Container>
        )
      }

      return (
        <Container className="class-composition contentContainer">
          <h3 className="contentHeader"> 
            <Icon name='linode' /> 
            Class Composition</h3>
            <Button color='blue' onClick={this.addClass}>
            Add class
            <Icon className="plus icon" name="plus"/>  
          </Button>
          <NoData/>
            {this.state.addClassModalOpen &&
            <AddNewClass
              onClose={this.onAddClassClose}
              onSave={() =>{
                this.fetchClasses();
              }}
            />
            }
        </Container>
      );
    }
  }
