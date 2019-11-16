import React from 'react';
import { Container } from "semantic-ui-react";
import './NotFound.scss'

export const NotFound = (props) => (
  <Container>
    <div className="notFond">
      <h1>404</h1>
      <h3>OOPS! NOTHING WAS FOUND</h3>
      <p>The page you are looking for is under construction or doesn't exist.</p>
    </div>
  </Container>
);
