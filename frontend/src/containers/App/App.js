import React from 'react';
import '../../assets/styles/global.scss';
import {Container} from 'semantic-ui-react';
import {Switch, Route} from 'react-router-dom';


import {Header} from '../../components/Header/Header';
//import {Footer} from '../../components/Footer/Footer';

import { Parent } from '../Parent/Parent';
import { NotFound } from '../NotFound/NotFound';
import { Student } from '../Student/Student';
import {LoginParent} from '../Login/LoginParent';

import {Marks}  from'../../components/Marks/Marks';
import { AppSidebar } from '../../components/Sidebar/Sidebar';

export class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header />

        <AppSidebar>
          {/* <Container> */}
            <Switch>  
              <Route exact path="/parent" component={Parent} />
              <Route exact path="/parent/student/:studentID" component={Student} />
              <Route exact path="/parent/student/:studentID/marks/"component={Marks}/>

              <Route exact path="/login/parent" component={LoginParent}/>

              <Route path="*" component={NotFound} />
            </Switch>
          {/* </Container> */}
        </AppSidebar>
        
        {/* <Footer /> */}
      </div>
    )
  }
}
