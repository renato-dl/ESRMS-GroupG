import React from 'react';
import { Card, Image, CardContent } from 'semantic-ui-react'

import IsAdminOfficer from '../../assets/images/adminOfficer.png'
import IsPrincipal from '../../assets/images/principal.png';
import IsParent from '../../assets/images/parent.png';
import IsTeacher from '../../assets/images/teacher.png';

const text={
    IsAdminOfficer: 'Admin Officer',
    IsParent: 'Parent',
    IsTeacher: 'Teacher',
    IsPrincipal: 'Principal',
}
const image = {
    IsAdminOfficer: IsAdminOfficer,
    IsParent: IsParent,
    IsTeacher: IsTeacher,
    IsPrincipal: IsPrincipal,
}

export const UserRoleCard = (props) => (
    <Card
        style={{margin:"20px"}}
        onClick={props.onClick ? props.onClick : null}
    >

        <Card.Content>
            <Card.Header  
            color='yellow' 
            textAlign = "center"
            style = {{fontSize:"35px", color:"#4d7198"}}
            >
                {text[props.role]}
            </Card.Header>
        </Card.Content>
        <CardContent>
            <Image src={image[props.role]} wrapped ui={false} width={260}/>
        </CardContent>
    </Card>
);
