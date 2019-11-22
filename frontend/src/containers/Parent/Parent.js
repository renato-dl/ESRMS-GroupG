import React from 'react';
import { Icon} from 'semantic-ui-react';
import { api } from '../../services/api';
import { StudentCard } from '../../components/StudentCard/StudentCard';
import './Parent.scss';
import {ApplicationStoreContext} from '../../store';
import { NoData } from '../../components/NoData/NoData';

export class Parent extends React.Component {
  static contextType = ApplicationStoreContext;

  state = {
    children: []
  };

  async componentDidMount() {
    const {params} = this.props.match;
    localStorage.setItem('parentID', params.parentID);
    const response = await api.parent.getChilds(params.parentID);
    if (response) {
      this.setState({children: response.data})
    }
  }
 
  selectChild = async (child) => {
    const {params} = this.props.match;
    localStorage.setItem('selectedChild', JSON.stringify(child));
    this.props.history.push(`/parent/${params.parentID}/student/${child.ID}/marks`)
  };

  render() {
    if(this.state.children.length) {
      return (
        <div className="contentContainer parent-container">
          <h3 className="contentHeader">
            <Icon name='braille' size="small" />
            Select/Switch child
          </h3>
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
    return(
      <div className="contentContainer">
        <h3 className="contentHeader">
          <Icon name='braille' size="small" />
          Select/Switch child
        </h3>
        <NoData/>
      </div>
    ); 
    
  }
}
