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
import {ChildAttendance} from '../../components/ChildAttendance/ChildAttendance';
import {Assignments} from '../../components/Assignments/Assignments';

//*** Teacher view Components */
import {Teacher} from '../Teacher/Teacher';
import {Marks}  from '../../components/Marks/Marks';
import {Topic}  from'../../components/Topic/Topic';
import {TeacherClasses}  from'../../components/TeacherClassesAbsence/TeacherClasses';
import {TeacherGrade} from '../../components/TeacherGrade/TeacherGrade';
import {PresentAbsentRecords}  from'../../components/TeacherClassesAbsence/PresentAbsentRecords/PresentAbsentRecords';
import {TeacherAssignments} from '../../components/TeacherAssignments/TeacherAssignments';
import {TeacherClassesNote} from '../../components/TeacherNote/TeacherClassesNote';
import {TeacherNote} from '../../components/TeacherNote/TeacherNote'
//*** SYSTEM Administrator Components */
import {SysAdmin} from '../SysAdmin/SysAdmin'
import {InternalAccounts} from '../../components/InternalAccounts/InternalAccounts'

//*** Admin officer view Components*/
import {Admin} from '../Admin/Admin';
import {ConfigParent} from '../../components/ConfigParent/ConfigParent';
import {ClassComposition} from '../../components/ClassComposition/ClassComposition';
import {AdminStudentsEnrollment} from '../../components/adminComponents/SudentsEntrollment/admin_StudentsEnrollment';

import { PrivateRoute } from '../../components/PrivateRoute/PrivateRoute';
import { Communications } from '../../components/adminComponents/Communications/Communications';
import { ParentCommunications } from '../../components/ParentCommunications/ParentCommunications';

export class App extends React.Component {
  static contextType = ApplicationStoreContext;

  state = { 
    active: true
  };

  toggleSidebar = () => this.setState((prevState) => ({ active: !prevState.active }));

  render() {

    return (
      <ApplicationStore>
        <div className="app">
          <Header />
          
          <AppSidebar visibility={this.state.active} updatedAt={this.state.updatedAt}>

            <Icon className="toggleIcon" name = "bars" size="big" onClick={this.toggleSidebar}/>

            <Switch>

              <PrivateRoute exact path="/parent" component={Parent} />
              <PrivateRoute exact path="/parent/student/:studentID" component={Student} />
              <PrivateRoute exact path="/parent/student/:studentID/marks" component={Marks}/>
              <PrivateRoute exact path="/parent/student/:studentID/assignments" component={Assignments}/>
              <PrivateRoute exact path="/parent/student/:studentID/attendance" component={ChildAttendance}/>
              <PrivateRoute exact path="/parent/communications" component={ParentCommunications}/> 
              
              <PrivateRoute exact path="/teacher" component={Teacher}/>
              <PrivateRoute exact path="/teacher/subjects" component={Teacher}/>
              <PrivateRoute exact path="/teacher/subjects/:classID/:subjectID/:subjectName/topics" component={Topic}/>
              <PrivateRoute exact path="/teacher/subjects/:classID/:subjectID/:subjectName/TeacherGrade" component={TeacherGrade}/>
              <PrivateRoute exact path="/teacher/subjects/:classID/:subjectID/:subjectName/assignments" component={TeacherAssignments}/>
              <PrivateRoute exact path="/teacher/classes" component={TeacherClasses}/>
              <PrivateRoute exact path="/teacher/classes/:ClassId/:ClassName/AttendanceRecords" component={PresentAbsentRecords}/>
              <PrivateRoute exact path="/teacher/classesfornote" component={TeacherClassesNote}/>
              <PrivateRoute exact path="/teacher/classesfornote/:ClassId/:ClassName/TeacherNote" component={TeacherNote}/>

              <PrivateRoute exact path="/admin" component={Admin}/>
              <PrivateRoute exact path="/admin/configParent" component={ConfigParent}/>
              <PrivateRoute exact path="/admin/ClassComposition" component={ClassComposition}/>
              <PrivateRoute exact path="/admin/enrollStudents" component={AdminStudentsEnrollment}/>
              <PrivateRoute exact path="/admin/communications" component={Communications}/> 

              <PrivateRoute exact path="/sysadmin" component={SysAdmin}/>
              <PrivateRoute exact path="/sysadmin/accounts" component={InternalAccounts}/>

              <Route path="*" component={NotFound} />
              
            </Switch>

          </AppSidebar>
        </div>
      </ApplicationStore>
    )
  }

}
