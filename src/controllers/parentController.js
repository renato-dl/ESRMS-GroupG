import {BaseController} from "./baseController";
import Student from "../database/models/student";
import Grade from '../database/models/grade';
import Subject from '../database/models/subject';
import Assignment from '../database/models/assignment';
import File from '../database/models/file';
import StudentAttendance from '../database/models/studentAttendance';
import SupportMaterial from '../database/models/supportMaterial';
import path from 'path';
import Note from '../database/models/note';
import fs from 'fs';

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

  async subjectsByStudentId(req, res) {
    if (!await Student.checkIfRelated(req.query.studentId, req.user.ID)) {
      res.send(401);
      return; 
    }
    const subjects = await Subject.findByStudentId(req.query.studentId);
    res.send(subjects);
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

  async getFile(req, res) {
    const fileKey = req.query.ID;
    if (!fileKey) {
      throw new Error("Missing or invalid file id");
    } 

    const file = await File.findOne({ Key: fileKey });
    if (!file) {
      return res.sendStatus(404);
    }

    const filePath = path.join(__dirname, "../../", "uploads", file.Key);
    if (!fs.existsSync(filePath)) {
      return res.sendStatus(404);
    }

    res.download(filePath);
  }

  async getNotes(req, res) {
    const related = await Student.checkIfRelated(req.query.studentId, req.user.ID);
    if (!related) {
      throw new Error('Student is not related to user');
    }
    const notes = await Note.findByStudentId(req.query.studentId);
    res.send(notes);
  }

  async getNote(req, res) {
    let note;
    try {
      note = await Note.findById(req.query.noteId)
    } catch (error) {
      throw new Error('Missing or invalid note id');
    }
    const related = await Student.checkIfRelated(note.StudentId, req.user.ID);
    if (!related) { 
      res.sendStatus(401);
      return;
    }
    res.send({description: note.Description});
    if (note.IsSeen == 0) {
      Note.update(req.query.noteId, {IsSeen: 1});
    }
  }

  async getSupportMaterial(req, res) {
    const related = await Student.checkIfRelated(req.params.studentId, req.user.ID);
    if (!related) {
      return res.sendStatus(401);
    }

    const supportMaterial = await SupportMaterial.findAllByStudent(
      req.params.studentId,
      { 
        subject: req.query.subject,
        to: req.query.to,
        from: req.query.from
      },
      {
        page: req.query.page,
        pageSize: req.query.pageSize
      }
    );
    
    res.send(supportMaterial);
  }

}

export default new ParentController();
