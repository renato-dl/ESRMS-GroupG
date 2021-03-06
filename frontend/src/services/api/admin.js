
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
  
  updateStudent(data) {
    return this.patch('admin/student', data)
  }  
  
  saveStudent(data) {
    return this.patch('admin/student', data);
  }
  
  getEnrolledStudentsByClass(data) {
    return this.get('/admin/students', data);   
  }

  sendStudentsToEnrollToClass(classId, students){
    return this.post(`admin/classes/${classId}/assign-students`, students);
  }

  removeStudentClassAssignment(studentId) {
    return this.delete(`/admin/students/${studentId}/removeClassAssignment`);
  }

  updateParent(data) {
    return this.patch('admin/parent',data)
  }

  removeStudent(studentID) {
    return this.delete('/admin/student', {ID: studentID});
  }

  getTeachers(s){
    return this.get(`/admin/teachers${s}`);
  }
  
  addNewClass(data){
    return this.post('/admin/class',data);
  }

  deleteClass(data){
    return this.delete('/admin/class', data);
  }

  getAllTeacherClassData(){
    return this.get('/admin/teacher-class');
  }

  createTeacherClassAssociation(data){
    return this.post('/admin/teacher-class', data);
  }

  deleteTeacherAssociation(id){
    return this.delete('/admin/teacher-class', {id:id});
  }

  getSubjectslist(){
    return this.get(`/subject/all`);
  }

  getAllTimetables(){
    return this.get('/timetable');
  }

  addClassTimetable(data){
    return this.post('/timetable', data);
  }

  deleteClassTimetable(classId){
    return this.delete(`/timetable/${classId}`);
  }
}