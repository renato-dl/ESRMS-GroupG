import React from 'react';
import {Header} from '../../components/Header/Header';
import {Footer} from '../../components/Footer/Footer';
import '../../assets/styles/global.scss';
import {Container} from 'semantic-ui-react';
import {Switch, Route} from 'react-router-dom';
import { Parents } from '../Parents/Parents';
import { NotFound } from '../NotFound/NotFound';

export class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header />

        <Container>
          
          <Switch>
            <Route path="/parents" component={Parents} />
            <Route path="*" component={NotFound} />
          </Switch>
          
        </Container>

        <Footer />
      </div>
    )
  }
}
