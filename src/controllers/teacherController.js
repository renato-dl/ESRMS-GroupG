import {BaseController} from "./baseController";
import Subject from "../database/models/subject";
import Topic from '../database/models/topic'

class TeacherController extends BaseController {

  // GET /teacher/:teacherId/subjects
  async subjectsByTeacherId(req, res) {
    const subjects = await Subject.findByTeacherId(req.params.teacherId);
    // TODO: get class orf 
    const response = []
    subjects.forEach(subject => {
      const elem = {"subjectId": subject['ID'], "subject": subject["Name"], "classId": subject["classid"]};
      response.push(elem);
    });
    res.send(response);
  }

  // POST /teacher/:teacherId/topic
  // Body: classId, subjectId, topicTitle, topicDescription, topicDate
  async addTopic(req, res) {
    const result = await Topic.insertNewTopic(req.params.teacherId, req.body.classId, req.body.subjectId, req.body.topicTitle, req.body.topicDescription, req.body.topicDate);
    res.send(result);
  }

  // PATCH /teacher/:teacherId/topic
  // Body: topicID, topicTitle, topicDescription, topicDate
  // Teacher can't modify class or subject
  async patchTopic(req, res) {
    const result = await Topic.editTopic(/* PARAMS*/);
    res.send(result);
  }

  /* GET /teacher/:teacherId/topics
            ?classId=123
            &subjectId=123
            &page=2&pageSize=10 [OPTIONAL]  */
  async topicsByTeacherClassSubject(req, res) {
    const result = await Topic.findByTeacherClassSubject(
      req.params.teacherId,
      req.query.classId, 
      req.query.subjectId,
      {page: req.query.page,
      pageSize: req.query.pageSize}
      );
    res.send(result);
  }
}


export default new TeacherController();
