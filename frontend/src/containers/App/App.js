import React from 'react';
import {Header} from '../../components/Header/Header';
import {Footer} from '../../components/Footer/Footer';
import '../../assets/styles/global.scss';
import {Container} from 'semantic-ui-react';


export class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header />

        <Container>
          
          Content goes here
          
        </Container>

        <Footer />
      </div>
    )
  }
}
