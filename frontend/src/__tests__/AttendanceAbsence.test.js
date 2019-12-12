import React from 'react';
import { AttendanceDetailsAbsence } from '../components/ChildAttendance/AttendanceDetails/AttendanceDetailsAbsence';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing AssignmentsDetailsm(Parent View) component', () => {
    
    const attendanceDataForModal = {
            Name:"Test Name", 
            Status:"Absence", 
            EntryTeacherName:"abc",
            Date:'12.10.2019'
    }
  
  test('Test if component is rendered', () => {
    shallow(
    <ApplicationStoreContext.Provider value={{props: {attendance: {attendanceDataForModal}}}}>
      <AttendanceDetailsAbsence/>
      </ApplicationStoreContext.Provider>
    );

  });
});
