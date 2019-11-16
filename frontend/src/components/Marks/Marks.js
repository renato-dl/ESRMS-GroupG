import React from 'react';
import { api } from '../../services/api';
import './Marks.scss';
import {ApplicationStoreContext} from '../../store';

export class Marks extends React.Component {
  static contextType = ApplicationStoreContext;

  constructor(props) {
      super(props);

      this.state = {
        marks: []
      }
    }
    
    async componentDidMount(){
      const {parent} = this.context.state;
      const response = await api.parent.getChildMarks(parent.ID, parent.selectedStudent.ID);
      if (response) {
        this.setState({ marks: response.data })
      }
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
