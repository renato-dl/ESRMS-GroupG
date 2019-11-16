import {BaseAPIService} from './base';

export class TeacherAPIService extends BaseAPIService {
  getTeacherSubjects(teacherId,classId,subjectId) {
    return this.get(`/teacher/${teacherId}/subjects`);
  }
  getTeacherTopics(teacherId,classId,subjectId) {
    return this.get(`/teacher/${teacherId}/topics?classId=${classId}&subjectId=${subjectId}`);
  }

}