import React from 'react';
import { api } from '../../services/api';

import {Link} from 'react-router-dom';

import {Icon,List} from 'semantic-ui-react';
import './Teacher.scss';

export class Teacher extends React.Component{
    constructor(props){
        super(props)
      
        this.state={
            sumbjectList:[]
        }
    }
            /* 
            {subjectId: 12, subject: 'math', class:'1A', classId : 1},
            {subjectId: 13, subject: 'physics', class:'1C', classId : 2},
            {subjectId: 15, subject: 'geography', class:'1A', classId : 1}
            */
        
    async componentDidMount(){
        //const response = await api.teacher.getTeacherSubjects(this.props.match.params.teacherID);
        const response = await api.teacher.getTeacherSubjects('6e5c9976f5813e59816b40a814e29899');

        console.log(response);
        if (response) {
            this.setState({ sumbjectList: response.data })
        }
    }


    render() {
    return (
        <div className="contentContainer">
            <h3 className="contentHeader">
                <Icon name='braille' size="small" />
                Teaching Plan, Subjects 
            </h3>

            <List  relaxed className="subjectList">

                {this.state.sumbjectList.map((subject, index)=>
                
                <List.Item className="myListItem" key={index} as={Link} to="/teacher/:teacherID/topics">
                    <List.Icon name='book' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='div' className="subjectListName"> {subject.subjectId}: {subject.subject.toUpperCase()} </List.Header>
                        <List.Description as='div' className="subjectListClass">Class {subject.classId}: {subject.class}</List.Description>
                    </List.Content>
                </List.Item>
                
                )}
            </List>
        </div>
    )}
}