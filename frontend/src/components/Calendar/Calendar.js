import React from 'react';
import * as BigCalendar from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = BigCalendar.momentLocalizer(moment);

export const Calendar = (props) => (
    <BigCalendar.Calendar
      localizer={localizer}
      events={props.events}
      defaulView="month"
      views={['month']}
      startAccessor="start"
      endAccessor="end"
      style={{height: 500}}
      onDoubleClickEvent={props.onDoubleClickEvent}
      onNavigate={props.onNavigate}
    />
);
