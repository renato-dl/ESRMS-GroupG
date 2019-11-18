import React from 'react';
import { Container, Icon} from "semantic-ui-react";
import './NoData.scss'

export const NoData = (props) => (
    <Container>
        <div className="noData">
            <h3><Icon name='database'/>  Nothing to see here</h3>
            <p>There are no records to show you right now.</p>
        </div>
    </Container>
    );
