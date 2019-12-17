import React from 'react';
import {getRouterPropsForTest} from '../utils';
import {shallow} from 'enzyme';
import TopicDelete from '../components/Topic/TopicDetail/TopicDelete';

describe('Testing of TopicDelete component (teacher page)', () => {
  
  test('Test if components for delete a topic are rendered', () => {
    shallow(
      <TopicDelete {...getRouterPropsForTest()} >
      </TopicDelete>
    );
  });

});
