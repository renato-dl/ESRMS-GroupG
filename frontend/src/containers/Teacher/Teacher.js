import React from 'react';
import { api } from '../../services/api';
import {Icon,List, Container,Button} from 'semantic-ui-react';
import './Teacher.scss';
import { NoData } from '../../components/NoData/NoData';

export class Teacher extends React.Component{
  state = {
    subjectsList:[]
  };

  async componentDidMount() {
    const {params} = this.props.match;
    const teacherID = window.location.href.substr(window.location.href.indexOf('/teacher/') + 9);
    localStorage.setItem('teacherID', teacherID);

    const response = await api.teacher.getTeacherSubjects(params.teacherID);
    if (response) {
      this.setState({ subjectsList: response.data })
    }
  }

  onSubjectClick = (subjectID,subjectName) => {
    //const {params} = this.props.match;
    this.props.history.push(`/teacher/subjects/${subjectID}/${subjectName}/topics`);
  };

  onSubjectGradeClick = (subjectID,subjectName)=>{
    this.props.history.push(`/teacher/subjects/${subjectID}/${subjectName}/TeacherGrade`);
  }

    render() {
      
    if(this.state.subjectsList.length){
      return (
          <Container className="contentContainer">
              <h3 className="contentHeader">
                <Icon name='braille'/>
                Teaching Plan
              </h3>

              <List relaxed>
                  {this.state.subjectsList.map((subject, index) =>
                    <List.Item className="myListItem" key={index}>
                        <List.Icon name='book' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header as='div' className="subjectListName">
                              {subject.subject.toUpperCase()}
                            </List.Header>

                            <List.Description as='div' className="subjectListClass">
                              Class: {subject.class}
                              <Button className='Topics' color='blue'  onClick={() => this.onSubjectClick(subject.subjectId,subject.subject)}>
                              Topics
                              </Button>
                              <Button className='Grades'  color='blue' onClick={()=>this.onSubjectGradeClick(subject.subjectId,subject.subject)}>
                              Grades
                              </Button>
                            </List.Description>
                        </List.Content>
                    </List.Item>
                  )}
              </List>
          </Container>
      );
    }
    return(
      <Container className="contentContainer">
        <h3 className="contentHeader">
          <Icon name='braille'/>
          Teaching Plan
        </h3>
        <NoData/>
      </Container>
    );
  }
}
