import { AuthAPIService } from './auth';
import { ParentAPIService } from './parent';
import {TeacherAPIService} from './teacher'

class Api {
  
  constructor() {
    this.auth = new AuthAPIService();
    this.parent = new ParentAPIService();
    this.teacher=new TeacherAPIService();
  }

}

export const api = new Api();
