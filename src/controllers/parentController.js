import {BaseController} from "./baseController";
import Student from "../database/models/student";
import Grade from '../database/models/grade';
import Assignment from '../database/models/assignment';
import StudentAttendance from '../database/models/studentAttendance';
import path from 'path';

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
    const grades = await Grade.findByStudentId(req.query.studentId, {page: req.query.page, pageSize: req.query.pageSize});
    res.send(grades);
  }

  async assignmentsByStudentId(req, res) {
    if (!req.query.studentId) {
      throw new Error('Missing or invalid studentId');
    }
    if (!await Student.checkIfRelated(req.query.studentId, req.user.ID)) {
      res.send(401);
      return;
    }
    
    const assignments = await Assignment.findByStudentId(
      req.query.studentId,  
      {from: req.query.fromDate, to: req.query.toDate},
      {page: req.query.page, pageSize: req.query.pageSize}
    );

    res.send(assignments);
  }
  
  async attendanceByStudentId(req, res) {
    if (!req.query.studentId) {
      throw new Error('Missing or invalid studentId');
    }
    if (!await Student.checkIfRelated(req.query.studentId, req.user.ID)) {
      res.send(401);
      return;
    }
    const attendance = await StudentAttendance.findByStudentId(
      req.query.studentId, 
      {from: req.query.fromDate, to: req.query.toDate},
      {page: req.query.page, pageSize: req.query.pageSize}
    );

    res.send(attendance);
  }

  async getAssignmentFile(req, res) {
    const fileKey = req.query.ID;
    
    if (!fileKey) {
      throw new Error("Missing or invalid assignment id");
    }

    const assignment = await Assignment.findOne({ AttachmentFile: fileKey });
    if (!assignment.AttachmentFile) {
      res.sendStatus(404);
      return;
    }

    const filePath = path.join(__dirname, "../../", "uploads", assignment.AttachmentFile);
    res.download(filePath);
  }
}

export default new ParentController();
