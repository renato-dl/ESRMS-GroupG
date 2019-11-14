import React from 'react';
import {Header} from '../../components/Header/Header';
import {Footer} from '../../components/Footer/Footer';
import '../../assets/styles/global.scss';
import {Container} from 'semantic-ui-react';
import {Switch, Route} from 'react-router-dom';
import { Parent } from '../Parent/Parent';
import { NotFound } from '../NotFound/NotFound';
import { Student } from '../Student/Student';
import {Marks}  from'../Marks/Marks';

export class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header />

        <Container>
          
          <Switch>
            
            <Route exact path="/parent" component={Parent} />
            <Route exact path="/student/:studentID" component={Student} />
            <Route exact path="/student/:studentID/marks/"component={Marks}/>
            <Route path="*" component={NotFound} />

          </Switch>
          
        </Container>

        <Footer />
      </div>
    )
  }
}
