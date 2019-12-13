import React from 'react';
import { AttendanceDetailsEexitLentry } from '../components/ChildAttendance/AttendanceDetails/AttendanceDetailsEexitLentry';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing AssignmentsDetailsm(Parent View) component', () => {
    
    const attendanceDataForModal = {
            Name:"Test Name", 
            Status:"Absence", 
            ExitTeacherName:"abc",
            Date:'12.10.2019',
            EarlyExit:'2h',
            EntryTeacherName:'dnc',
            LateEntry:'2h'
    }
  
  test('Test if component is rendered', () => {
    shallow(
    <ApplicationStoreContext.Provider value={{props: {attendance: {attendanceDataForModal}}}}>
      <AttendanceDetailsEexitLentry/>
      </ApplicationStoreContext.Provider>
    );

  });
});
