import React from 'react';
import { api } from '../../services/api';
import {Table, Icon} from 'semantic-ui-react';
import moment from 'moment';
import ConfigParentDetails from "./ConfigParentDetails/ConfigParentDetails"
import { NoData } from '../NoData/NoData';

export class ConfigParent extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      authParents: [],
      isConfigParentDetailsOpen: false
    }
  }

  fetchParents =  async () => {
    //const {params} = this.props.match;
    const response = await api.admin.getAuthParentList();
    if (response) {
        console.log(response);
      this.setState({ authParents: response.data });
    }
  };

  async componentDidMount() {
    await this.fetchParents();
  }

  addParent = () => {
    this.setState({isConfigParentDetailsOpen: true});
  };

  onConfigPrentDetailsClose = () => {
    this.setState({isConfigParentDetailsOpen: false});
  };

  render() {
    if(this.state.authParents.length){
    return (
      <div className="contentContainer">
        <h3 className="contentHeader">
          <Icon name='braille' size="small" />
          Parents Accounts Configuration
        </h3>

        <button className="ui vk button" onClick={this.addParent}>
          <i className="user plus icon"></i>
           Add Parent
        </button>

        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign="left">#</Table.HeaderCell>
                    <Table.HeaderCell textAlign="left">NAME</Table.HeaderCell>
                    <Table.HeaderCell textAlign="left">SURMANE</Table.HeaderCell>
                    <Table.HeaderCell textAlign="left">SSN</Table.HeaderCell>
                    <Table.HeaderCell textAlign="left">EMAIL</Table.HeaderCell>
                    <Table.HeaderCell textAlign="left">AUTH DATE</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {this.state.authParents.map((parent, index) =>
                <Table.Row key={index}>
                <Table.Cell textAlign="left" width={1}>{ index + 1 }</Table.Cell>
                <Table.Cell textAlign="left">{ parent.FirstName }</Table.Cell>
                <Table.Cell textAlign="left">{ parent.LastName }</Table.Cell>
                <Table.Cell textAlign="left">{ parent.SSN }</Table.Cell>

                <Table.Cell textAlign="left">{ parent.eMail }</Table.Cell>
                <Table.Cell textAlign="left" width={2}>{ moment(parent.CreatedOn).format('LL') }</Table.Cell>

                </Table.Row>
            )}
            </Table.Body>
        </Table>

        {this.state.isConfigParentDetailsOpen &&
          <ConfigParentDetails
            onClose={this.onConfigPrentDetailsClose}
            onSave={() => {
              this.fetchParents();
              this.onConfigPrentDetailsClose();
            }}
          />
        }
      </div>
    );
  }
  return(
    <div className="contentContainer">
      <h3 className="contentHeader">
          <Icon name='braille' size="small" />
          Parents Accounts Configuration
        </h3>

        <button className="ui vk button" onClick={this.addParent}>
          <i className="user plus icon"></i>
           Add Parent
        </button>
      <NoData/>
      {this.state.isConfigParentDetailsOpen &&
          <ConfigParentDetails
            onClose={this.onConfigPrentDetailsClose}
            onSave={() => {
              this.fetchParents();
              this.onConfigPrentDetailsClose();
            }}
          />
      }
    </div>
  );
  }
}