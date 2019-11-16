import React from 'react';
import '../../assets/styles/global.scss';
import {Container} from 'semantic-ui-react';
import {Switch, Route} from 'react-router-dom';
import {Parent} from '../Parent/Parent';
import { NotFound } from '../NotFound/NotFound';
import { Student } from '../Student/Student';

import {Teacher} from '../Teacher/Teacher';

import {Marks}  from '../../components/Marks/Marks';
import {Header}  from '../../components/Header/Header';

import {ApplicationStore, ApplicationStoreContext} from '../../store';

import { AppSidebar } from '../../components/Sidebar/Sidebar';

export class App extends React.Component {
  static contextType = ApplicationStoreContext;

  render() {
    return (
      <ApplicationStore>
        <div className="app">
          <Header />

          <AppSidebar>

            <Switch>

              <Route exact path="/parent" component={Parent} />
              <Route exact path="/parent/student/:studentID" component={Student} />
              <Route exact path="/parent/student/:studentID/marks/" component={Marks}/>
              <Route exact path="/teacher" component={Teacher}/>
              <Route path="*" component={NotFound} />

            </Switch>

          </AppSidebar>
        </div>
      </ApplicationStore>
    )
  }
}
