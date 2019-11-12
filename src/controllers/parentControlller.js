import { BaseController } from "./baseController";
import Student from "../database/models/student";
import Grade from '../database/models/grade'
import uuid from 'uuid';

class ParentController extends BaseController {

  async studentsByParentId(req, res) {
    const students = await Student.findByParentId(req.params.parentId);
    res.send(students);
  }

  async gradesByStudentId(req, res) {
    // TODO: fix pagination
    const grades = await Grade.findByStudentId(req.params.parentId, req.query.studentId);
    res.send(grades);
  }

}

export default new ParentController();
