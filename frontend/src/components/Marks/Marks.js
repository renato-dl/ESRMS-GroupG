import React from 'react';
import { api } from '../../services/api';
import './Marks.scss';

export class Marks extends React.Component{
    constructor(props) {
      super(props);

      this.state = {
        marks: []
      }
    }
    
    async componentDidMount(){
      const response = await api.parent.getChildMarks('9d64fa59c91d9109b11cd9e05162c675', '266667153e975bbf735b89d4b03d9f93');
      console.log(response);
      if (response) {
        this.setState({ marks: response.data })
      }
    }

    selectMarks = async (studentID) => {
      console.log(studentID);
      this.props.history.push('/marks')
    }

    render(){
      return (
        <div className="Marks-container">
          <h2 className="title">Student{this.props.match.params.studentID}'s score:</h2>
          {this.state.marks.map((mark) =>
            <p>
              Subject: { mark.Name },
              Marks: { mark.Grade }
            </p>
          )}
        </div>
      )
    }
}
