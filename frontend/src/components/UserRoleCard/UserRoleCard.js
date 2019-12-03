import React from 'react';
import { Card, Image, CardContent } from 'semantic-ui-react'

//import IsAdminOfficer from '../../assets/images/adminOfficer.png'
import IsAdminOfficer from '../../assets/images/adminOfficer2.jpg'

import IsPrincipal from '../../assets/images/principal.png';
import IsParent from '../../assets/images/parent.png';
import IsTeacher from '../../assets/images/teacher.png';
import IsSysAdmin from '../../assets/images/sysAdmin.png'

const text={
    IsAdminOfficer: 'Secretary Officer',
    IsParent: 'Parent',
    IsTeacher: 'Teacher',
    IsPrincipal: 'Principal',
    IsSysAdmin: 'System Admin',
}
const image = {
    IsAdminOfficer: IsAdminOfficer,
    IsParent: IsParent,
    IsTeacher: IsTeacher,
    IsPrincipal: IsPrincipal,
    IsSysAdmin: IsSysAdmin,
}

export const UserRoleCard = (props) => (
    <div style={{width: '230px', margin: '10px',float:"left"}}>
    <Card style = {{margin: '20px', background: '#f7f7f7' }}
        onClick={props.onClick ? props.onClick : null} //fluid
    >
        <Card.Content>
            <Card.Header textAlign = "center" style = {{fontSize:"24px", color:"#4d7198"}}>
                {text[props.role]}
            </Card.Header>
        </Card.Content>
        <CardContent>
            <Image src={image[props.role]} wrapped ui={false} width={200}/>
        </CardContent>
    </Card>
    </div>
);
