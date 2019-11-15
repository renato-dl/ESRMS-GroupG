import React from 'react';
import {Header as SemanticHeader, Icon, Dropdown} from 'semantic-ui-react';
import './Header.scss';

const trigger = (
  <span><Icon name='user' /></span>
)

const options = [
  {
    key: 'user',
    text: (
      <span>
        Signed in as <strong>Bob Smith</strong>
      </span>
    ),
    disabled: true,
  },
  { key: 'sign-out', text: 'Sign Out' }
]

export const Header = (props) => (
  <SemanticHeader className="app-header">
    <div className="headerlogoField"><Icon name="leaf" className="logoIcon"/>ESRMS-G</div>
    <div className="headerToolbarFiled">
     <Dropdown trigger={trigger} options={options} />
    </div>

  </SemanticHeader>
);
