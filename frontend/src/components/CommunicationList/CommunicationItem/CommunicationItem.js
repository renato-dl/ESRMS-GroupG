import React from 'react';
import './CommunicationItem.scss';
import moment from 'moment';

export const CommunicationItem = (props) => {
  const classes = ['communication-item'];
  const hasExpired = moment().startOf('day') > moment(props.communication.DueDate).startOf('day');
  if (hasExpired) {
    classes.push('expired');
  }

  if (props.communication.IsImportant) {
    classes.push('important');
  }

  return (
    <div onClick={() => props.onClick(props.communication)} className={classes.join(' ')}>
      <div className="wrapper">
        <h3 className="title">{props.communication.Title}</h3>
        <div className="description">
          {props.communication.Description}
        </div>
      </div>
    </div>
  );
}
