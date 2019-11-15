import React from 'react';
import { api } from '../../services/api';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import './Stundent.scss';

export class Student extends React.Component {
  state = {
    id: 1,
    firtName: 'Tarzan',
    lastName: 'Prenga'
  }
  
  async componentDidMount() {
    const response = await api.parent.selectChid(1, this.props.match.params.studentID);
    if (response) {
      this.setState({children: response.data});
    }
  }

  render() {
    return (
      <div className="student-container">
        <h2 className="title">Students place in here</h2>

        {/* This will be removed at for the moment is only to display the data */}
        <StudentCard {...this.state} />

      </div>
    )
  }
}
