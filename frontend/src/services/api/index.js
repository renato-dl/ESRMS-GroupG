import { AuthAPIService } from './auth';
import { ParentAPIService } from './parent';
import {TeacherAPIService} from './teacher'
import { AdminAPIService } from './admin';
import { SysAdminAPIService } from './sysadmin';
class Api {
  
  constructor() {
    this.auth = new AuthAPIService();
    this.parent = new ParentAPIService();
    this.teacher = new TeacherAPIService();
    this.admin = new AdminAPIService();
    this.sysadmin = new SysAdminAPIService();
  }

}

export const api = new Api();
