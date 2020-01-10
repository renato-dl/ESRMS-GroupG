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
  getAssignments(subjectId, classId, from, to){
    return this.get(`/teacher/assignments?subjectId=${subjectId}&classId=${classId}&fromDate=${from}&toDate=${to}`);
  }

  // assignment file
  getAssignmentFile(fileID) {
    return this.get(`/teacher/assignment/file?ID=${fileID}`, null, 'arraybuffer');
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

  recordLateEntry(data){
    return this.post('teacher/late_entry', data)
  }

  recordEarlyExit(data){
    return this.post('teacher/early_exit', data)
  }
  
  getNotes(cId){
    return this.get(`teacher/notes?classId=${cId}`);
  }

  saveNote(data){
    return this.post('teacher/note', data);
  }

  updateNote(data) {
    return this.patch('teacher/note',data);
  }
  deleteNote(data){
    return this.delete(`/teacher/note`, data);
  }

  // Support Material

  getMaterialBySubject(subject){
    return this.get(`/teacher/support-material?subject=${subject}`);
  }

  addMaterialBySubjectId(data){
    return this.post('/teacher/support-material', data);
  }

  deleteMaterialById(data){
    return this.delete('/teacher/support-material', data);
  }

  /* getSubjectslist(){
    return this.get(`/subject/all`);
  } */
}