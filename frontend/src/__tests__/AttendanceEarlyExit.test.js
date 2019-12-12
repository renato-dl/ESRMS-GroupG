import React from 'react';
import { AttendanceDetailsEarlyexit } from '../components/ChildAttendance/AttendanceDetails/AttendanceDetailsEarlyexit';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing AssignmentsDetailsm(Parent View) component', () => {
    
    const attendanceDataForModal = {
            Name:"Test Name", 
            Status:"Absence", 
            ExitTeacherName:"abc",
            Date:'12.10.2019',
            EarlyExit:'2h'
    }
  
  test('Test if component is rendered', () => {
    shallow(
    <ApplicationStoreContext.Provider value={{props: {attendance: {attendanceDataForModal}}}}>
      <AttendanceDetailsEarlyexit/>
      </ApplicationStoreContext.Provider>
    );

  });
});
