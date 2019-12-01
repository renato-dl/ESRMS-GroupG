
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


  getStudentsToEnroll(data){
    return this.get('/admin/students', data);
  }

  getEnrolledStudentsByClass(classId){
      return this.get('/admin/students', classId);   
  }

  sendStudentsToEnrollToClass(classId, students){
    return this.post(`admin/classes/${classId}/assign-students`, students);
  }
}