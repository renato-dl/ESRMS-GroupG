import React from 'react';
import {Header as SemanticHeader, Icon,Image, Dropdown} from 'semantic-ui-react';

import logoImage from '../../assets/images/logo.png';
import './Header.scss';

const trigger = (
  <span style={{color:"#DBFDFC"}}><Icon name='user' />
  {/* Hi Bob &nbsp; */}
  </span>
)

const options = [
  // {
  //   key: 'user',
  //   text: (<span>Signed in as <strong>Name Surname</strong></span>),
  //   disabled: true,
  // },
  { key: 'signOut', text: 'Sign Out' }
]

let logOut = (e) => {
  localStorage.removeItem("token");
  window.location.replace("/login")  
};

export const Header = (props) => {
  return (
    <SemanticHeader className="app-header">
      <div className="headerlogoField">
        
        {/* <Icon name="leaf" className="logoIcon"/> */}
        <Image src={logoImage} size="tiny"  verticalAlign="bottom"/> 
          
        ESRMS-G</div>
      <div className="headerToolbarFiled">
        <Dropdown 
          trigger={trigger} 
          options={options} 
          onChange={logOut}
        />
      </div>

    </SemanticHeader>
  );
};
