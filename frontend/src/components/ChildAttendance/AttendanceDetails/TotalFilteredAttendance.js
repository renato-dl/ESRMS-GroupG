import React, { Component } from 'react';
import {Table, Modal, Icon} from 'semantic-ui-react';
import moment from 'moment';


export class TotalFilteredAttendance extends Component {
    
    render() {
        const {modalArr, modalTitle} = this.props;
        return (
            <Modal dimmer open className="account-detail" size="tiny">
                <Modal.Header style={{textAlign:'center'}}>
                <span>{modalTitle}</span>
                <Icon onClick={() => this.props.onClose()} className="archive deleteIconModal" name="close" />
                </Modal.Header>
                <Modal.Content>
                    <Table color='teal' >
                        <Table.Header>
                            <Table.Row positive>
                                <Table.HeaderCell textAlign="left">Date</Table.HeaderCell>
                                {modalTitle === "Late Entry" && <Table.HeaderCell textAlign="left">Late Entry</Table.HeaderCell>}
                                {modalTitle === "Early Exit" && <Table.HeaderCell textAlign="left">Early Exit</Table.HeaderCell>}
                                {modalTitle === "Absent" && <Table.HeaderCell textAlign="left">Absent</Table.HeaderCell>}
                                <Table.HeaderCell textAlign="left">Teacher</Table.HeaderCell>
                                
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        {modalArr.map((rec, index) =>
                            <Table.Row key = {index}>
                            <Table.Cell textAlign="left">{moment(rec.Date).format('MMM D, YYYY')}</Table.Cell>
                            {modalTitle === "Late Entry" && <Table.Cell textAlign="left">{rec.LateEntry}</Table.Cell>}
                            {modalTitle === "Early Exit" && <Table.Cell textAlign="left">{rec.EarlyExit}</Table.Cell>}
                            {modalTitle === "Absent" && <Table.Cell textAlign="left">{rec.title}</Table.Cell>}
                            {modalTitle !== "Early Exit" && <Table.Cell textAlign="left">{rec.EntryTeacherName}</Table.Cell>}
                            {modalTitle === "Early Exit" && <Table.Cell textAlign="left">{rec.ExitTeacherName}</Table.Cell>}
                            </Table.Row>
                        )}
                        </Table.Body>
                    </Table>
                </Modal.Content>
            </Modal> 
        )
    }
}

export default TotalFilteredAttendance
