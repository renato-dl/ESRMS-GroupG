import React from 'react';
import {CommunicationDetails} from '../components/adminComponents/Communications/CommunicationDetails/CommunicationDetails';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';

describe('Testing CommunicationDetails component', () => {
  
  test('Test if CommunicationDetails component is rendered', () => {
    shallow(
      <CommunicationDetails {...getRouterPropsForTest()} />
    );
  });

});
