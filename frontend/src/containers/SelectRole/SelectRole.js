import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import './SelectRole.scss'

import { UserRoleCard } from '../../components/UserRoleCard/UserRoleCard';


export class SelectRole extends Component {
    state = {
        roles:[
            {role: "IsAdminOfficer"},
            {role: "IsParent"}, 
            {role: "IsTeacher"},
            {role: "IsPrincipal"}]
    };

//TODO: selectPage() function, set/get roles, name, Surname of user from localStorage?

    render() {
        return (
            <>
            <div className="background"></div>
                    <Container>
                        <div className="cardContainer">
                        {this.state.roles.map((role, index) => (
                        <UserRoleCard
                            key={index}
                            {...role}
                            onClick={() => this.selectPage(role)}
                        />
                        ))}
                        </div>
                </Container>
            </>
        )
    }
}

export default SelectRole
