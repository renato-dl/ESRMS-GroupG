import React from 'react';
import { api } from '../../services/api';
import {Icon, Container,Button, Card, Image} from 'semantic-ui-react';
import './Teacher.scss';
import { NoData } from '../../components/NoData/NoData';

import SubjectIcon from '../../assets/images/subject4.png';

export class Teacher extends React.Component{
  state = {
    subjectsList:[]
  };

  async componentDidMount() {
    const response = await api.teacher.getTeacherSubjects();
    if (response) {
      this.setState({ subjectsList: response.data })
    }
  }

  onSubjectClick = (subjectID,subjectName, classId) => {
    //const {params} = this.props.match;
    this.props.history.push(`/teacher/subjects/${classId}/${subjectID}/${subjectName}/topics`);
  };

  onSubjectGradeClick = (subjectID,subjectName, classId)=>{
    this.props.history.push(`/teacher/subjects/${classId}/${subjectID}/${subjectName}/TeacherGrade`);
  }

  onSubjectAssignmentClick = (subjectID, subjectName, classId)=>{
    this.props.history.push(`/teacher/subjects/${classId}/${subjectID}/${subjectName}/assignments`);
  }

    render() {
      
    if(this.state.subjectsList.length){
      return (
          <Container className="contentContainer">
              <h3 className="contentHeader">
                <Icon name='braille'/>
                Teaching Activity
              </h3>

              {/* <List relaxed>
                  {this.state.subjectsList.map((subject, index) =>
                    <List.Item className="myListItem" key={index}>
                        <List.Icon name='book' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header as='div' className="subjectListName">
                              {subject.subject.toUpperCase()}
                            </List.Header>

                            <List.Description as='div' className="subjectListClass">
                              <div className='classname'>
                              Class: {subject.class}
                              </div>
                              <div>
                                  <Button className='Topics' color='blue'  onClick={() => this.onSubjectClick(subject.subjectId,subject.subject, subject.classId)}>
                                  Topics
                                  </Button>
                                  <Button className='Grades'  color='blue' onClick={()=>this.onSubjectGradeClick(subject.subjectId,subject.subject, subject.classId)}>
                                  Grades
                                  </Button>
                                  <Button className='Grades'  
                                  color='blue' 
                                  onClick={()=>this.onSubjectAssignmentClick(subject.subjectId, subject.subject, subject.classId)}>
                                  Assignments
                                  </Button>
                                </div>
                            </List.Description>
                        </List.Content>
                    </List.Item>
                  )}
              </List> */}



              <Card.Group>
                {this.state.subjectsList.map((subject, index) =>
                    <Card style = {{borderLeft: "5px solid #008272", width:'334px', borderRadius: '0'}} key={index}>
                        <Card.Content>
                            <Image
                            floated='right'
                            size='mini'
                            src={SubjectIcon}
                            />
                            <Card.Header>{subject.subject.toUpperCase()}</Card.Header>
                            <Card.Meta><h3>Class: {subject.class}</h3></Card.Meta>
                        </Card.Content>
                        <Card.Content extra style={{textAlign:'center'}}>
                            <Button className='subjectButtons' color='vk'  onClick={() => this.onSubjectClick(subject.subjectId,subject.subject, subject.classId)}>
                            Topics
                            </Button>
                            <Button className='subjectButtons'  
                            color='vk' 
                            onClick={()=>this.onSubjectAssignmentClick(subject.subjectId, subject.subject, subject.classId)}>
                            Assignments
                            </Button>
                            <Button className='subjectButtons'  color='vk' onClick={()=>this.onSubjectGradeClick(subject.subjectId,subject.subject, subject.classId)}>
                            Grades
                            </Button>
                        </Card.Content>
                    </Card>
                )}
              </Card.Group>


          </Container>
      );
    }
    return(
      <Container className="contentContainer">
        <h3 className="contentHeader">
          <Icon name='braille'/>
          Teaching Activity
        </h3>
        <NoData/>
      </Container>
    );
  }
}
