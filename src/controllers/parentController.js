import {BaseController} from "./baseController";
import Student from "../database/models/student";
import Grade from '../database/models/grade'

class ParentController extends BaseController {

  async studentsByParentId(req, res) {
    const students = await Student.findByParentId(req.user.ID);
    res.send(students);
  }

  async gradesByStudentId(req, res) {
    const grades = await Grade.findByStudentId(req.user.ID, req.query.studentId, {page: req.query.page, pageSize: req.query.pageSize});
    res.send(grades);
  }
}

export default new ParentController();
