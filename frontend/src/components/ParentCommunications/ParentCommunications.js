import React from 'react';
import {Icon, Container, } from 'semantic-ui-react';
import { CommunicationList } from '../../components/CommunicationList/CommunicationList';
import { api } from '../../services/api';
import { CommunicationInfo } from '../../components/CommunicationList/CommunicationInfo/CommunicationInfo';
import { NoData } from '../NoData/NoData';

export class ParentCommunications extends React.Component {
  state = {
    communications: [],
    communication: null,
    isComminicationInfoModalOpen: false
  }

  async componentDidMount() {
    await this.fetchCommunications();
  }

  fetchCommunications = async () => {
    const communications = await api.communication.listForParent();

    this.setState({ 
      communications: communications.data.communications, 
      isComminicationInfoModalOpen: false, 
    });
  };

  closeCommunicationInfoModal = () => {
    this.setState({ isComminicationInfoModalOpen: false });
  }

  openCommunicationInfoModal = (communication) => {
    this.setState({ communication, isComminicationInfoModalOpen: true });
  }

  render() {
    return (
      <Container className="contentContainer">
        <h3 className="contentHeader">
          <Icon name='bullhorn'/>
          Communications
        </h3>

        {!this.state.communications.length && <NoData />}

        {!!this.state.communications.length && 
          <CommunicationList
            communications={this.state.communications}
            onClick={this.openCommunicationInfoModal}
          />
        }

        {this.state.isComminicationInfoModalOpen && 
          <CommunicationInfo
            communication={this.state.communication}
            onUpdate={this.updateCommunication}
            onDelete={this.deleteCommunication}
            onClose={this.closeCommunicationInfoModal}
          />
        }
      </Container>
    )
  }
}
