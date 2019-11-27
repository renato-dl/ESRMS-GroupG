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
}