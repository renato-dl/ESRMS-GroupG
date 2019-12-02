import React from 'react';
import '../../assets/styles/global.scss';
import 'toastr/toastr.scss';
import {Icon} from 'semantic-ui-react';

import {Switch, Route} from 'react-router-dom';

import {ApplicationStore, ApplicationStoreContext} from '../../store';

import {Header}  from '../../components/Header/Header';
import {NotFound} from '../NotFound/NotFound';
import {AppSidebar} from '../../components/Sidebar/Sidebar';

//*** Parent view Components */
import {Parent} from '../Parent/Parent';
import {Student} from '../Student/Student';

//*** Teacher view Components */
import {Teacher} from '../Teacher/Teacher';
import {Marks}  from '../../components/Marks/Marks';
import {Topic}  from'../../components/Topic/Topic';

//*** SYSTEM Administrator Components */
import {SysAdmin} from '../SysAdmin/SysAdmin'
import {InternalAccounts} from '../../components/InternalAccounts/InternalAccounts'

//*** Admin officer view Components*/
import {Admin} from '../Admin/Admin';
import {ConfigParent} from '../../components/ConfigParent/ConfigParent';

import {Class_composition} from '../../components/class_composition/class_composition';

import {admin_StudentsEnrollment} from '../../components/adminComponents/SudentsEntrollment/admin_StudentsEnrollment';
import {TeacherGrade} from '../../components/TeacherGrade/TeacherGrade';

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
              <Route exact path="/parent" component={Parent} />
              <Route exact path="/parent/student/:studentID" component={Student} />
              <Route exact path="/parent/student/:studentID/marks/" component={Marks}/>
              
              <Route exact path="/teacher" component={Teacher}/>
              <Route exact path="/teacher/subjects" component={Teacher}/>
              <Route exact path="/teacher/subjects/:subjectID/:subjectName/topics" component={Topic}/>
              <Route exact path="/teacher/subjects/:classID/:subjectID/:subjectName/TeacherGrade" component={TeacherGrade}/>

			        <Route exact path="/admin" component={Admin}/>
              <Route exact path="/admin/configParent" component={ConfigParent}/>
              <Route exact path="/admin/Class_composition" component={Class_composition}/>
              <Route exact path="/admin/enrollStudents" component={admin_StudentsEnrollment}/>

              <Route exact path="/sysadmin" component={SysAdmin}/>
              <Route exact path="/sysadmin/accounts" component={InternalAccounts}/>

              <Route path="*" component={NotFound} />
              
            </Switch>

          </AppSidebar>
        </div>
      </ApplicationStore>
    )
  }
}
