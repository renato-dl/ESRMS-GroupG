import {BaseController} from "./baseController";
import Student from "../database/models/student";
import Grade from '../database/models/grade'

class ParentController extends BaseController {

  async studentsByParentId(req, res) {
    const students = await Student.findByParentId(req.user.ID);
    res.send(students);
  }

  async gradesByStudentId(req, res) {
    if (!await Student.checkIfRelated(req.query.studentId, req.user.ID)) {
      res.send(401);
      return;
    }
    const grades = await Grade.findByStudentId(studentId, {page: req.query.page, pageSize: req.query.pageSize});
    res.send(grades);
  }
}

export default new ParentController();
