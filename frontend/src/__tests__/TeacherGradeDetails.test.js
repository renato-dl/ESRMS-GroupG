import React from 'react';
import TeacherGradeDetails from '../components/TeacherGrade/TeacherGrade';
import {ApplicationStoreContext} from '../store';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TeacherGradeDetails component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
        
    <ApplicationStoreContext.Provider value={{state: {classId:"1", subjectId:"1"}}}>
      <TeacherGradeDetails {...getRouterPropsForTest()} />
    </ApplicationStoreContext.Provider>
    );
  });

});
