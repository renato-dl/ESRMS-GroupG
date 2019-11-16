import React from 'react';
import { api } from '../../services/api';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import './Parent.scss';
import {ApplicationStoreContext} from '../../store';

export class Parent extends React.Component {
  static contextType = ApplicationStoreContext;

  state = {
    children: []
  };

  async componentDidMount() {
    const response = await api.parent.getChilds(this.context.state.parent.ID);
    if (response) {
      this.setState({children: response.data})
    }
  }

  selectChild = async (child) => {
    this.context.setSelectedStudent(child);
    this.props.history.push(`/parent/student/${child.ID}`);
  };

  render() {
    return (
      <div className="parent-container">
        <h2 className="title">My children</h2>

        <div className="children">
          {this.state.children.map((child, index) => (
            <StudentCard
              key={index}
              {...child}
              onClick={() => this.selectChild(child)}
            />
          ))}
        </div>

      </div>
    );
  }
}
