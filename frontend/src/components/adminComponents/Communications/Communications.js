import React from 'react';
import './Communications.scss';
import {Icon, Container, Button} from 'semantic-ui-react';
import { CommunicationList } from '../../CommunicationList/CommunicationList';
import { api } from '../../../services/api';
import * as toastr from 'toastr';
import { CommunicationDetails } from './CommunicationDetails/CommunicationDetails';
import { CommunicationInfo } from '../../CommunicationList/CommunicationInfo/CommunicationInfo';

export class Communications extends React.Component {
  state = {
    communications: [],
    communication: null,
    isCommunicationModalOpen: false,
    isComminicationInfoModalOpen: false
  }

  async componentDidMount() {
    await this.fetchCommunications();
  }

  fetchCommunications = async () => {
    const communications = await api.communication.list();

    this.setState({ 
      communications: communications.data.communications, 
      isComminicationInfoModalOpen: false, 
      isCommunicationModalOpen: false 
    });
  };

  addNewCommunication = () => {
    this.setState({ isCommunicationModalOpen: true, communication: null });
  }

  updateCommunication = async (communication) => {
    this.setState({ communication, isCommunicationModalOpen: true, isComminicationInfoModalOpen: false });
  }

  deleteCommunication = async (communicationID) => {
    try {
      await api.communication.remove(communicationID);
      await this.fetchCommunications();
      toastr.success('Communication removed successfully.');
    } catch(err) {
      toastr.error(err);
    }
  }

  closeCommunicationDetailsModal = () => {
    this.setState({ isCommunicationModalOpen: false });
  }

  closeCommunicationInfoModal = () => {
    this.setState({ isComminicationInfoModalOpen: false });
  }

  openCommunicationInfoModal = (communication) => {
    this.setState({ communication, isComminicationInfoModalOpen: true });
  }

  onCreateOrUpdateCommunication = async (data) => {
    if (data.ID) {
      await api.communication.update(data.ID, data.Title, data.Description, data.IsImportant, data.DueDate);
    } else {
      await api.communication.add(data.Title, data.Description, data.IsImportant, data.DueDate);
    }

    await this.fetchCommunications();
  };

  render() {
    return (
      <Container className="contentContainer">
        <h3 className="contentHeader">
          <Icon name='bullhorn'/>
          Communications
        </h3>

        <Button className="ui vk button" onClick={this.addNewCommunication}>
          <i className="plus icon"></i>
          New
        </Button>

        <CommunicationList
          communications={this.state.communications}
          onClick={this.openCommunicationInfoModal}
        />

        {this.state.isCommunicationModalOpen && 
          <CommunicationDetails
            communication={this.state.communication}
            onClose={this.closeCommunicationDetailsModal}
            onSave={this.onCreateOrUpdateCommunication}
          />
        }

        {this.state.isComminicationInfoModalOpen && 
          <CommunicationInfo
            isAdmin={true}
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
