
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

  insertNewStudent(data){
    return this.post('/admin/student', data);
  }

  getClasslist(){
    return this.get(`/admin/classes`)
  }

  getStudentsToEnroll(data){
    return this.get('/admin/students', data);
  }

  
  getStudents() {
    return this.get('/admin/students');
  }
<<<<<<< HEAD

  updateStudent(data)
  {
    return this.patch('admin/student',data)
  }  
=======
  
  saveStudent(data) {
    return this.patch('admin/student',data);
  }
    
>>>>>>> d9b4436836eebd6f893320085a58034460bb5241
  getEnrolledStudentsByClass(classId){
      return this.get('/admin/students', classId);   
  }

  sendStudentsToEnrollToClass(classId, students){
    return this.post(`admin/classes/${classId}/assign-students`, students);

  }
  updateParent(data)
  {
    return this.patch('admin/parent',data)
  }
}