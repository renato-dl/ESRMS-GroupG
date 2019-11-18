import React from 'react';
import { api } from '../../services/api';
import {Icon,List} from 'semantic-ui-react';
import './Teacher.scss';
import { NoData } from '../../components/NoData/NoData';

export class Teacher extends React.Component{
  state = {
    subjectsList:[]
  };

  async componentDidMount(){
    const response = await api.teacher.getTeacherSubjects('6e5c9976f5813e59816b40a814e29899');

    if (response) {
      this.setState({ subjectsList: response.data })
    }
  }

  onSubjectClick = (subjectID) => {
    this.props.history.push(`/teacher/6e5c9976f5813e59816b40a814e29899/subjects/${subjectID}/topics`);
  };

    render() {
      
    if(this.state.subjectsList.length){
      return (
          <div className="contentContainer">
              <h3 className="contentHeader">
                <Icon name='braille' size="small" />
                Teaching Plan
              </h3>

              <List relaxed className="subjectList">
                  {this.state.subjectsList.map((subject, index) =>
                    <List.Item className="myListItem" key={index} onClick={() => this.onSubjectClick(subject.subjectId)}>
                        <List.Icon name='book' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header as='div' className="subjectListName">
                              {subject.subject.toUpperCase()}
                            </List.Header>

                            <List.Description as='div' className="subjectListClass">
                              Class: {subject.class}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                  )}
              </List>
          </div>
      );
    }
    return(
      <div className="contentContainer">
        <h3 className="contentHeader">
          <Icon name='braille' size="small" />
          Teaching Plan
        </h3>
        <NoData/>
      </div>
    );
  }
}