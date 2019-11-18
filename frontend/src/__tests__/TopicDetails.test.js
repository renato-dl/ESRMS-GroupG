import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import TopicDetails from '../components/Topic/TopicDetail/TopicDetails';

describe('Testing TopicDetails component', () => {
  
  test('Test if component is rendered', () => {
    shallow(
      <TopicDetails {...getRouterPropsForTest()} />
    );
  });

});
