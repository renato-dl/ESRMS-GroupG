import React from 'react';
import { api } from '../../services/api';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import './Parent.scss';

export class Parent extends React.Component {
  state = {
    children: [
      {id: 1, firstName: 'Name', lastName: 'Surname'},
      {id: 2, firstName: 'Nam2', lastName: 'Surname2'},
      {id: 3, firstName: 'Nam3', lastName: 'Surname3'}
    ]
  }

  async componentDidMount() {
    const response = await api.parent.getChilds(1);
    if (response) {
      this.setState({children: response.data})
    }
  }

  selectChild = async (childId) => {
    console.log(childId);
    this.props.history.push(`/student/${childId}`);
  }

  render() {
    return (
      <div className="parent-container">
        <h2 className="title">My children</h2>

        <div className="children">
          {this.state.children.map((child, index) => (
            <StudentCard 
              key={index}
              {...child} 
              selected={child.id === this.state.selectedChild}
              onClick={() => this.selectChild(child.id)} 
            />
          ))}
        </div>
      </div>
    )
  }
}
