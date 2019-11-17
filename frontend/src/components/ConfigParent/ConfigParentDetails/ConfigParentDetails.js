import React from 'react'
import {Button, Modal, Form, LabelDetail, Icon} from 'semantic-ui-react'

//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

import "./ConfigParentDetails.scss";
import {api} from '../../../services/api';
import { withRouter } from "react-router";

class ConfigParentDetails extends React.Component {
    state = {
        isSaving: false
    };
    
    onClose = () => {
        if (this.state.isSaving) {
          return;
        }
        this.props.onClose();
      };

    render(){
        return(


            <Modal dimmer="blurring" open className="topic-detail" size="small">
        <Modal.Header>
          <span>Add a Parent</span>
          <Icon onClick={this.onClose} className="close-icn" name="close" />
        
        </Modal.Header>
        <Modal.Content>
          <p>blablablablab</p>
        </Modal.Content>
        <Modal.Actions>
          <Button/>

        </Modal.Actions>
      </Modal>
        )

    }
}

export default withRouter(ConfigParentDetails);