import {BaseAPIService} from './base';

export class TeacherAPIService extends BaseAPIService {

  getTeacherSubjects(teacherId) {
    return this.get(`/teacher/subjects`);
  }

  getTeacherTopics(classId, subjectId) {
    return this.get(`/teacher/topics?classId=${classId}&subjectId=${subjectId}`);
  }

  saveTopic(data) {
    return this.post(`/teacher/topic`, data);
  }

  updateTopic(data) {
    return this.patch(`/teacher/topic`, data);
  }

  deleteTopic(data){
    return this.delete(`/teacher/topic`, data);
  }

  getTeacherGrades(classId,subjectId){
    return this.get(`/teacher/grades?subjectId=${subjectId}&classId=${classId}`);
  }

  getStudentsByClass(classId){
    return this.get('/teacher/students', classId);   
  }

  addMark(data){
    return this.post('/teacher/grade', data);
  }

  updateMark(data){
    return this.patch('/teacher/grade', data);
  }

  deleteMark(data){
    return this.delete('/teacher/grade', data);
  }

  // assignments
  getAssignments(classId, subjectId, from, to){
    return this.get(`/teacher/assignments?subjectId=${subjectId}&classId=${classId}&fromDate=${from}&toDate=${to}`);
  }

  // subjectId, classId, Title, Description, DueDate
  addAssignment(data){
    return this.post('/teacher/assignment', data);
  }

  // classId, subjectId, assignmentId, title, description, dueDate
  updateAssignment(data){
    return this.patch('/teacher/assignment', data);
  }

  // ID
  deleteAssignment(data){
    return this.delete(`/teacher/assignment`, data);
  }

  getTeacherClasses(){
    return this.get(`/teacher/classes`);
  }

  getTeacherAttendance(cId, date){
    return this.get(`/teacher/attendance?classId=${cId}&date=${date}`);
  }

  registerBulkAbsence(data){
    return this.post('teacher/absences', data)
  }
}