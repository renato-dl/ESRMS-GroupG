import React from 'react';
import * as BigCalendar from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './TeacherAssignmentCalendar.scss';

const localizer = BigCalendar.momentLocalizer(moment);

export const TeacherAssignmentCalendar = (props) => {
  // NOTE: extend and pass this function on the component that will apply it
  // the event has all the required informaton to make everything work.
  const eventPropGetter = (event, start, end, isSelected) => {
    return { className: 'default-eavent', style: {background: 'red'} };
  }

  return (
      <BigCalendar.Calendar
        selectable
        className="big-calendar"
        popup
        localizer={localizer}
        events={props.events}
        defaulView="month"
        views={['month']}
        startAccessor="start"
        endAccessor="end"
        style={{height: 400}}
        onDoubleClickEvent={props.onDoubleClickEvent}
        onNavigate={props.onNavigate}
        eventPropGetter={props.eventPropGetter || eventPropGetter}
      />
  )
}
