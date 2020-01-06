import React from 'react';
import {TimetableUpload} from '../components/FileUpload/TimetableUpload';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing TimeTableUpload component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TimetableUpload {...getRouterPropsForTest()} />
    );
  });

});
