import React from 'react';
import {Header as SemanticHeader, Icon,Image, Dropdown} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import logoImage from '../../assets/images/logo.png';
import './Header.scss';



export const Header = withRouter(({history, ...props}) => {
  const trigger = (
    <span style={{color:"#DBFDFC"}}>
      <Icon name='user' />
    </span>
  );

  const switchAccount = () => {
    history.push("/roles");
  };

  const changePassword = () => {
    history.push("/changePassword")
  }
  
  const logOut = () => {
    //localStorage.removeItem("token");
    //localStorage.removeItem("role");
    //localStorage.removeItem("roles");
    //localStorage.removeItem("serializedState");
    localStorage.clear();
    window.location.replace("/login");
  };

  const hasMultipleRoles = !!localStorage.getItem('roles');

  return (
    <SemanticHeader className="app-header">
      <div className="headerlogoField">
        <Image src={logoImage} size="tiny"  verticalAlign="bottom"/> 
        ESRMS-G
      </div>

      <div className="headerToolbarFiled">
        <Dropdown trigger={trigger}>
          <Dropdown.Menu className="dropdown">
            {hasMultipleRoles && <Dropdown.Item text='Switch account' icon="shuffle" onClick={switchAccount} />}
            <Dropdown.Item text='Change Password' icon="unlock alternate" onClick={changePassword} />
            <Dropdown.Divider />
            <Dropdown.Item text='Logout' icon="sign out" onClick={logOut} />
          </Dropdown.Menu>
        </Dropdown>
      </div>

    </SemanticHeader>
  );
});
