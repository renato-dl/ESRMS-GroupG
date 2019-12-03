import React from 'react';
import {Header as SemanticHeader, Icon,Image, Dropdown} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import logoImage from '../../assets/images/logo.png';
import './Header.scss';



export const Header = withRouter(({history, ...props}) => {
  const trigger = (
    <span style={{color:"#DBFDFC"}}><Icon name='user' />
    {/* Hi Bob &nbsp; */}
    </span>
  );
  

  const getOptions = () => {
    const options = [
      { key: 'signOut', text: 'Sign Out', value: 2 }
    ];

    const hasMultipleRoles = !!localStorage.getItem('roles');
    if (hasMultipleRoles) {
      options.unshift({ key: 'SwitchAccount', text: 'Switch Account', value: 1 });
    }

    return options;
  }

  const handleChange = (e, {value}) => {
    if (value === 1) {
      switchAccount();
    } else if (value === 2) {
      logOut();
    }
  }

  const switchAccount = () => {
    history.push("/roles");
  };
  
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("roles");
    window.location.replace("/login");
  };

  return (
    <SemanticHeader className="app-header">
      <div className="headerlogoField">
        <Image src={logoImage} size="tiny"  verticalAlign="bottom"/> 
        ESRMS-G
      </div>

      <div className="headerToolbarFiled">
        <Dropdown
          trigger={trigger} 
          options={getOptions()} 
          onChange={handleChange}
        />
      </div>

    </SemanticHeader>
  );
});
