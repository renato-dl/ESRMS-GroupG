import React from 'react';
import { AttendanceDetailsLateentry} from '../components/ChildAttendance/AttendanceDetails/AttendanceDetailsLateentry';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing AssignmentsDetailsm(Parent View) component', () => {
    
    const attendanceDataForModal = {
            Name:"Test Name", 
            Status:"Absence", 
            EntryTeacherName:"abc",
            Date:'12.10.2019',
            LateEntry:'2h'
    }
  
  test('Test if component is rendered', () => {
    shallow(
    <ApplicationStoreContext.Provider value={{props: {attendance: {attendanceDataForModal}}}}>
      <AttendanceDetailsLateentry/>
      </ApplicationStoreContext.Provider>
    );

  });
});
