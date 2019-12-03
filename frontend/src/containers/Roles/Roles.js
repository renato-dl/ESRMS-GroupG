import React from 'react';
import { Grid, Header, Container } from 'semantic-ui-react';
import {UserRoleCard} from '../../components/UserRoleCard/UserRoleCard';

import '../Login/Login.scss';

export class Roles extends React.Component {
  state = {
    roles: []
  }

  componentDidMount() {
    try {
      const roles = JSON.parse(localStorage.getItem('roles'));

      if (!roles) {
        window.location.replace("/login");  
      }

      this.setState({ roles });
    } catch (e) {
      window.location.replace("/login");  
    }
  }

  handleRouteOf = (role) => {
    console.log(role);
    localStorage.setItem("role", role);
    switch(role) {
        case "IsParent":
            this.props.history.push('/parent');
            break;
        case "IsTeacher":
            this.props.history.push('/teacher');
            break;
        case "IsPrincipal":
            this.props.history.push('/admin');
            break;
        case "IsAdminOfficer":
            this.props.history.push('/admin');
            break;
        case "IsSysAdmin":
            this.props.history.push('/sysadmin');
            break;
        default:
            console.log('Invalid role.');
            break;
    }
  }

  render() {
    return (
      <>
        <div className="loginBackground"></div>
        <Container>
          <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column className="roleGrid">
              <Header as='h2' icon textAlign='center' className="roles-text">
                <Header.Content style = {{textAlign:'left', paddingLeft: "35px", color: "rgb(77, 113, 152)"}}>
                    Welcome! Please select your account type.
                </Header.Content>
              </Header>
              
              <div className = "rolesContainer">    
                  {this.state.roles.map((role, index) => (
                      <UserRoleCard
                          key={index}
                          {...role}
                          onClick={() => this.handleRouteOf(role.role)}
                      />
                  ))}
              </div>
            </Grid.Column>
          </Grid>
        </Container>
      </>
    )
  }
}
