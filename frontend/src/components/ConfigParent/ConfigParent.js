import React from 'react';
import { api } from '../../services/api';

import {Link} from 'react-router-dom';

import {Icon,List} from 'semantic-ui-react';


export class ConfigParent extends React.Component{

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
                Parents Accounts Configuration 
            </h3>
        </div>
    )}
}