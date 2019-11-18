import React from 'react';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import './Stundent.scss';
import {ApplicationStoreContext} from '../../store';

export class Student extends React.Component {
  static contextType = ApplicationStoreContext;

  showMarks = async () => {
    this.props.history.push(`/parent/student/${this.props.match.params.studentID}/marks`);
  };

  render() {
    const {selectedStudent} = this.context.state.parent;

    return (
      <div className="student-container">
        <h2 className="title">Students place in here</h2>
        <StudentCard {...selectedStudent} />

        <button className='student_grades' type='button' onClick={this.showMarks} >
          Show grades
        </button>

      </div>
    )
  }
}