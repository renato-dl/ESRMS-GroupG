import {BaseAPIService} from './base';

export class TeacherAPIService extends BaseAPIService {

  getTeacherSubjects(teacherId, classId, subjectId) {
    return this.get(`/teacher/${teacherId}/subjects`);
  }

  getTeacherTopics(teacherId, classId, subjectId) {
    return this.get(`/teacher/${teacherId}/topics?classId=${classId}&subjectId=${subjectId}`);
  }

  saveTopic(teacherId, data) {
    return this.post(`/teacher/${teacherId}/topic`, data);
  }

  updateTopic(teacherId, data) {
    return this.patch(`/teacher/${teacherId}/topic`, data);
  }
}