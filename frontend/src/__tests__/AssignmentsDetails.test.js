import React from 'react';
import { AssignmentsDetails } from '../components/Assignments/AssignmentDetails/AssignmentDetails';
import {shallow} from 'enzyme';
import {ApplicationStoreContext} from '../store';

describe('Testing AssignmentsDetailsm(Parent View) component', () => {
    
    const assignmentForModal = {
            Name:"Test Name", 
            Title:"Test Title", 
            Description:"Test Description", 
            DueDate:"12.05.2019"
    }
  
  test('Test if component is rendered', () => {
    shallow(
    <ApplicationStoreContext.Provider value={{props: {assignment: {assignmentForModal}}}}>
      <AssignmentsDetails/>
      </ApplicationStoreContext.Provider>
    );

  });
});
