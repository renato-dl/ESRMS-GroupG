import { AuthAPIService } from './auth';
import { ParentAPIService } from './parent';
import {TeacherAPIService} from './teacher'
import { AdminAPIService } from './admin';
import { SysAdminAPIService } from './sysadmin';
import { CommunicationAPIService } from './communication';
class Api {
  
  constructor() {
    this.auth = new AuthAPIService();
    this.parent = new ParentAPIService();
    this.teacher = new TeacherAPIService();
    this.admin = new AdminAPIService();
    this.sysadmin = new SysAdminAPIService();
    this.communication = new CommunicationAPIService();
  }

}

export const api = new Api();
