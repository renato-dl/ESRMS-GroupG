import React from 'react';
import { Icon} from 'semantic-ui-react';
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
        <h3 className="contentHeader">
        <Icon name='braille' size="small" />
        Select/Switch child</h3>
        {/* <h2 className="title">My children</h2> */}
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
