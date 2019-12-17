import React from 'react';
import './CommunicationList.scss';
import { CommunicationItem } from './CommunicationItem/CommunicationItem';

export const CommunicationList = (props) => {
  return (
    <div className="communication-list">
      {props.communications.map((communication) => (
        <CommunicationItem 
          key={communication.ID}
          communication={communication}
          onClick={props.onClick}
          onUpdate={props.onUpdate}
          onDelete={props.onDelete}
        />
      ))}
    </div>
  );
}
