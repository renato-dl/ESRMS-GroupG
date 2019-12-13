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

  getTeacherClasses(){
    return this.get(`/teacher/classes`);
  }
}