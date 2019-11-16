import React from 'react';
import { Icon} from 'semantic-ui-react';
import { api } from '../../services/api';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import './Parent.scss';

export class Parent extends React.Component {
  state = {
    children: [
  }

  async componentDidMount() {
    const response = await api.parent.getChilds('9d64fa59c91d9109b11cd9e05162c675');
    if (response) {
      this.setState({children: response.data})
    }
  }

  selectChild = async (childId) => {
    console.log(childId);

    this.props.history.push(`/parent/student/${childId}`);
  }

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
              selected={child.id === this.state.selectedChild}
              onClick={() => this.selectChild(child.ID)} 
            />
          ))}
        </div>
      </div>
    )
  }
}
