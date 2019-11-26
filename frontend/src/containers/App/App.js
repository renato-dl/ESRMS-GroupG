import React from 'react';
import '../../assets/styles/global.scss';
import 'toastr/toastr.scss';
import {Container, Icon} from 'semantic-ui-react';

import {Switch, Route} from 'react-router-dom';

import {ApplicationStore, ApplicationStoreContext} from '../../store';

import {Header}  from '../../components/Header/Header';
import {NotFound} from '../NotFound/NotFound';
import {AppSidebar} from '../../components/Sidebar/Sidebar';

import {Parent} from '../Parent/Parent';
import {Student} from '../Student/Student';
import {Teacher} from '../Teacher/Teacher';
import {Marks}  from '../../components/Marks/Marks';
import {Topic}  from'../../components/Topic/Topic';
import {Admin} from '../Admin/Admin';
import {ConfigParent} from '../../components/ConfigParent/ConfigParent';



export class App extends React.Component {
  static contextType = ApplicationStoreContext;

  state = {active:true}
  toggleSidebar = () =>
    this.setState((prevState) => ({ active: !prevState.active }))


  render() {

    return (
      <ApplicationStore>
        <div className="app">
          <Header />
          
          <AppSidebar visibility={this.state.active}>

            <Icon className="toggleIcon" name = "bars" size="big" onClick={this.toggleSidebar}/>

            <Switch>
              <Route exact path="/parent/:parentID" component={Parent} />
              <Route exact path="/parent/:parentID/student/:studentID" component={Student} />
              <Route exact path="/parent/:parentID/student/:studentID/marks/" component={Marks}/>
              
              <Route exact path="/teacher/:teacherID" component={Teacher}/>
              <Route exact path="/teacher/:teacherID/subjects" component={Teacher}/>
              <Route exact path="/teacher/:teacherID/subjects/:subjectID/topics" component={Topic}/>

			        <Route exact path="/admin" component={Admin}/>
              <Route exact path="/admin/configParent" component={ConfigParent}/>
              <Route path="*" component={NotFound} />
              
            </Switch>

          </AppSidebar>
        </div>
      </ApplicationStore>
    )
  }
}
