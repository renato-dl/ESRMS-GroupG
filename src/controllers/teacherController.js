import {BaseController} from "./baseController";
import Subject from "../database/models/subject";
import Topic from '../database/models/topic'

class TeacherController extends BaseController {

  // GET /teacher/:teacherId/subjects
  async subjectsByTeacherId(req, res) {
    const subjects = await Subject.findByTeacherId(req.params.teacherId);
    res.send(subjects);
  }

  // POST /teacher/:teacherId/addTopic
  // Body: classId, subjectId, topicTitle, topicDescription, topicDate
  async addTopic(req, res) {
    const result = await Topic.insertNewTopic(/* PARAMS*/);
    res.send(result);
  }

}

export default new TeacherController();
