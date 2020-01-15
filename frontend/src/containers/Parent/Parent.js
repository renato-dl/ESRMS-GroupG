import React from 'react';
import { Icon, Container} from 'semantic-ui-react';
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
    const response = await api.parent.getChilds();
    if (response) {
      this.setState({children: response.data})
    }
    localStorage.removeItem('selectedChild');
    this.context.setSelectedStudent({});
  }
 
  selectChild = async (child) => {
    localStorage.setItem('selectedChild', JSON.stringify(child));
    this.context.setSelectedStudent(child);
    this.props.history.push(`/parent/student/${child.ID}/marks`)
  };

  render() {
    if(this.state.children.length) {
      return (
        <Container className="contentContainer parent-container">
          <h3 className="contentHeader">
            <Icon name='braille'/>
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
        </Container>
      );
    }
    return(
      <Container className="contentContainer">
        <h3 className="contentHeader">
          <Icon name='braille'/>
          Select/Switch child
        </h3>
        <NoData/>
      </Container>
    ); 
    
  }
}
