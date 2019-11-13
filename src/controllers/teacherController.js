import {BaseController} from "./baseController";
import Subject from "../database/models/subject";
//import Grade from '../database/models/grade'

class TeacherController extends BaseController {

  // /teacher/:teacherId/subjects
  async subjectsByTeacherId(req, res) {
    const subjects = await Subject.findByTeacherId(req.params.teacherId);
    res.send(subjects);
  }

  // /teacher/:teacherId/subjects
  async gradesByStudentId(req, res) {
    const grades = await Grade.findByStudentId(req.params.parentId, req.query.studentId, {page: req.query.page, pageSize: req.query.pageSize});
    res.send(grades);
  }

}

export default new TeacherController();
