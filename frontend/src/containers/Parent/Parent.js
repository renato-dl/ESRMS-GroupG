import React from 'react';
import { api } from '../../services/api';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import './Parent.scss';

export class Parent extends React.Component {
  state = {
    children: []
  }

  async componentDidMount() {
    const response = await api.parent.getChilds('9d64fa59c91d9109b11cd9e05162c675');
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
              selected={child.ID === this.state.selectedChild}
              onClick={() => this.selectChild(child.ID)} 
            />
          ))}
        </div>
      </div>
    )
  }
}
