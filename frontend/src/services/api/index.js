import { AuthAPIService } from './auth';
import { ParentAPIService } from './parent';
import {TeacherAPIService} from './teacher'
import { AdminAPIService } from './admin';

class Api {
  
  constructor() {
    this.auth = new AuthAPIService();
    this.parent = new ParentAPIService();
    this.teacher = new TeacherAPIService();
    this.admin = new AdminAPIService();
  }

}

export const api = new Api();
