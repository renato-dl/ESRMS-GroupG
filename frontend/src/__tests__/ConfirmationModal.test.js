import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import ConfirmationModal from '../components/TeacherClassesAbsence/PresentAbsentRecords/RecordDetails/ConfirmationModal';
import {ApplicationStoreContext} from '../store';
describe('Testing ConfirmationModal component', () => {
  
  test('Test if component ConfirmationModal (teacher)is rendered', () => {
    shallow(
      <ApplicationStoreContext.Provider value={{state: {userID: '26ce21c0-8d32-41d1-8d07-b4994fa53edf'}}}>
      <ConfirmationModal {...getRouterPropsForTest()} />
      </ApplicationStoreContext.Provider>
    );
  });

});

