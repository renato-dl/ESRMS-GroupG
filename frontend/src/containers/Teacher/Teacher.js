import React from 'react';
import { api } from '../../services/api';

import {Icon,List} from 'semantic-ui-react';
import './Teacher.scss';

export class Teacher extends React.Component{
    constructor(props){
      super(props)
      this.state={
        sumbjectList:[
            {subjectId: 12, subject: 'math', class:'1A', classId : 1},
            {subjectId: 13, subject: 'physics', class:'1C', classId : 2},
            {subjectId: 15, subject: 'geography', class:'1A', classId : 1}
        ]
        }
    }

    render() {
    return (
        <div className="contentContainer">
            <h3 className="contentHeader">
            <Icon name='braille' size="small" />
            Subjects assigned to you </h3>

            <List  relaxed className="subjectList">

                {this.state.sumbjectList.map((subject, index)=>
                
                <List.Item className="myListItem" key={index}>
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