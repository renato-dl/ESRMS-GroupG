
import {BaseAPIService} from './base';

export class AdminAPIService extends BaseAPIService {

    getAuthParentList() {
    return this.get(`/admin/parents`);
  }

  saveNewParent(data) {
    return this.post(`/admin/parent`, data);
  }

  searchParentBySSN(str) {
    return this.get(`/admin/find-parents?ssn=${str}`);
  }

  saveNewStudent(data){
    return this.post('/admin/student', data);
  }


}