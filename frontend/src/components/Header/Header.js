import React from 'react';
import {Header as SemanticHeader, Icon,Image, Dropdown} from 'semantic-ui-react';

import logoImage from '../../assets/images/logo.png';
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
    <div className="headerlogoField">
       
      <Icon name="leaf" className="logoIcon"/>
       
        {/* 
       <Image src={logoImage} size="tiny"  verticalAlign="bottom"/>&nbsp; 
        */}
       ESRMS-G</div>
    <div className="headerToolbarFiled">
     {/* <Dropdown trigger={trigger} options={options} /> */}
    </div>

  </SemanticHeader>
);
