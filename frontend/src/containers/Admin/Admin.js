import React from 'react';
import { api } from '../../services/api';

import { ConfigParent } from '../../components/ConfigParent/ConfigParent';
import {Link} from 'react-router-dom';

import {Icon,List} from 'semantic-ui-react';
import './Admin.scss';

export class Admin extends React.Component{
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
        <ConfigParent/>
    )}
}