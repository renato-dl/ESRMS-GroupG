import React from 'react';
import { api } from '../../services/api';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import './Parents.scss';

export class Parents extends React.Component {
  state = {
    children: [
      {id: 1, firstName: 'Name', lastName: 'Surname'},
      {id: 2, firstName: 'Nam2', lastName: 'Surname2'},
      {id: 3, firstName: 'Nam3', lastName: 'Surname3'}
    ],
    selectedChild: null
  }

  async componentDidMount() {
    // const response = await api.parent.getChilds(1);
    // this.setState({children: response.data});
  }

  selectChild = async (childId) => {
    console.log(childId);
    this.setState({selectedChild: childId});
    // const response = await api.parent.selectChid(1, childId);
    // console.log(response);
  }

  render() {
    return (
      <div className="parents-container">
        <h2 className="title">My children</h2>

        <div className="children">
          {this.state.children.map((child) => (
            <StudentCard 
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
