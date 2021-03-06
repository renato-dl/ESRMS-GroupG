import {BaseController} from "./baseController";
import Subject from "../database/models/subject";
import Topic from '../database/models/topic';
import Class from '../database/models/class';
import TCSR from '../database/models/teacherClassSubject';
import Grade from '../database/models/grade';
import Note from '../database/models/note';
import SupportMaterial from '../database/models/supportMaterial';
import Student from '../database/models/student';
import StudentAttendance from '../database/models/studentAttendance';
import ClassAttendance from '../database/models/classAttendance';
import Assignment from '../database/models/assignment';
import File from '../database/models/file';
import path from 'path';
import moment from 'moment';
import db from '../database';
import fs from 'fs';

class TeacherController extends BaseController {

  async addAttachmentsToAssignment(assignmentId, files) {
    files = files.map((file) => {
      return {
        Key: file.filename,
        Name: file.originalname,
        Size: file.size,
        Type: file.mimetype
      }
    });

    const fileIds = await File.createMany(files);
    await Assignment.addAttachments(assignmentId, fileIds);
  }

  // GET /teacher/subjects
  async subjectsByTeacherId(req, res) {
    const subjects = await Subject.findByTeacherId(req.user.ID);
    const response = []
    for(let i = 0; i < subjects.length; i++){
      const subject = subjects[i];
      const classId = subject["classid"];
      let classN = await Class.getClassNameById(classId);
      const elem = {"subjectId": subject['ID'], 
      "subject": subject["Name"], 
      "classId": subject["classid"],
      "class": classN };
      response.push(elem);
    }
    res.send(response);
  }

  // POST /teacher/:teacherId/topic
  // Body: classId, subjectId, topicTitle, topicDescription, topicDate
  async addTopic(req, res) {
    const result = await Topic.insertNewTopic(
      req.user.ID, 
      req.body.classId, 
      req.body.subjectId, 
      req.body.topicTitle, 
      req.body.topicDescription, 
      req.body.topicDate
      );
    res.send(result);
  }

  //DELETE /teacher/topic
  //Body:classId, subjectId, topicID
  async deleteTopic(req, res) {
    const result = await Topic.deleteTopic(
      req.user.ID, 
      req.body.ID
      //req.query.topicId
      );
    res.send(result);
  }

  // PATCH /teacher/:teacherId/topic
  // Body: topicID, topicTitle, topicDescription, topicDate
  // Teacher can't modify class or subject
  async patchTopic(req, res) {
    try{
      const teacherId = req.user.ID;
      const topicId = req.body.topicId;
      const topicTitle = req.body.topicTitle;
      const topicDescription = req.body.topicDescription;
      const topicDate = req.body.topicDate;
      const result = await Topic.editTopic(teacherId, topicId, topicTitle, topicDescription, topicDate);
      res.send(result);
    }
    catch(e){
      console.log(e);
      const editTopicResult = {};
      editTopicResult["Success"] = false;
      editTopicResult["Message"] = "Something went wrong.";
      res.send(editTopicResult);
    }
  }

  /* GET /teacher/:teacherId/topics
            ?classId=123
            &subjectId=123
            &page=2&pageSize=10 [OPTIONAL]  */
  async topicsByTeacherClassSubject(req, res) {
    const result = await Topic.findByTeacherClassSubject(
      req.user.ID,
      req.query.classId, 
      req.query.subjectId,
      {page: req.query.page,
      pageSize: req.query.pageSize}
      );
    res.send(result);
  }

  /* GET /teacher/grades?
            classId=123&
            subjectId=456     */
  async gradesByClassAndSubject(req, res) {
    if(!await TCSR.checkIfTeacherTeachesSubjectInClass(
      req.user.ID,
      req.query.subjectId,
      req.query.classId
    )) {
      res.send(401);
      return;
    }
    res.send(await Grade.findByClassAndSubject(
      req.query.classId,
      req.query.subjectId,
      {page: req.query.page, pageSize: req.query.pageSize}
    ));
  }


  // POST /teacher/grade
  // Body: subjectId, studentId, grade, type, gradeDate
  async addGrade(req, res) {
    if(!await TCSR.checkIfTeacherTeachesToStudent(
      req.user.ID,
      req.body.studentId,
      req.body.subjectId)
      ){
        res.sendStatus(401);
        return;
    }

    await this.attendanceCheck(req.body.gradeDate, req.body.studentId);

    const result = await Grade.addGrade(
      req.body.subjectId,
      req.body.studentId,
      req.body.grade,
      req.body.gradeDate,
      req.body.type
     );
    res.send({success: true, id: result.id});
  }

  async attendanceCheck(date, studentId) {
    //attendance check

    const student = await Student.findById(studentId);

    const classAttendance = await ClassAttendance.hasAttendanceBeenRegistered(student.ClassId, date);
    if (!classAttendance) {
      throw new Error('No attendance info available');
    }
    const attendance = await StudentAttendance.findByStudentId(studentId, {
      from: moment.utc(date).format('YYYY-MM-DD'),
      to: moment.utc(date).format('YYYY-MM-DD')
    });
    if (attendance.length != 0 && attendance[0].LateEntry == null && attendance[0].EarlyExit == null) {
      throw new Error('Student is absent');
    }
  }

  // PATCH /teacher/grade
  // Body: classId, subjectId, studentId, grade, type
  async updateGrade(req, res) {
    const teacherTeachesInClass = await TCSR.checkIfTeacherTeachesSubjectInClass(
      req.user.ID,
      req.body.subjectId, 
      req.body.classId
    );

    const isGradeFromTeacher = await Grade.checkIfGradeIsFromTeacher(req.body.ID, req.user.ID);

    if(!teacherTeachesInClass || !isGradeFromTeacher) {
      res.send(401);
      return;
    } 

    const success = await Grade.updateGrade(
      req.body.ID,
      req.body.grade,
      req.body.type 
    );

    res.send({ success });
  }

  //DELETE /teacher/grade
  //Body: ID
  async deleteGrade(req, res) {
    if(!await Grade.checkIfGradeIsFromTeacher(req.body.ID, req.user.ID)){
      res.send(401);
      return;
    }
    
    await Grade.remove(
      req.body.ID
    );

    res.send({success: true});
  }

  // Get students by classId if only classId is present on query
  // Get students by classId and subjectId if both are present on query
  async getStudents(req, res) {
    let students = [];

    if (req.query.classId && !req.query.subjectId) {
      students = await Student.getStudentsDataByClassId(req.query.classId);
      return res.send(students);
    }
    
    if (req.query.classId && req.query.subjectId) {
      students = await Student.getStudentsDataByClassIdAndSubjectId(req.user.ID, req.query.classId, req.query.subjectId);
      return res.send(students); 
    }

    res.send(students);
  }

  async getClasses(req, res) {
    const classes = await TCSR.getTeachingClasses(req.user.ID)
    res.send(classes);
  }

  /*
  async registerSingleAbsence(req, res) {
    const result = await StudentAttendance.registerSingleAbsence(
      req.body.studentId,
      req.user.ID
    );
    res.send({
      success: true,
      id: result.id
    });
  }
  */

  /* POST /teacher/absences
   * Body:
    {
     "classId": 2,
     "students":
     [
       "7f32bd55-9222-4dde-9cf4-fb1edb5148cc",
       "aa49b76d-0308-44ce-a111-dcf31fd7678c"	
     ]
    }
   */ 
  async registerBulkAbsence(req, res) {
    if (!req.body.students || !Array.isArray(req.body.students)) {
      throw new Error('Missing or invalid students array');
    }
    let result = 0;
    if (req.body.students.length > 0) {
      const students = await Student.findByClassId(req.body.classId);
      for (let i=0; i< req.body.students.length; i++) {
        const found = students.find(element => {
          return element.StudentId == req.body.students[i];
        })
        if (!found) {
          throw new Error('One or more students do not belong to provided class')
        }
      }
      await ClassAttendance.registerAttendanceForToday(req.body.classId);
      result = (await StudentAttendance.registerBulkAbsence(
        req.body.students,
        req.user.ID
      )).affectedRows;
    } else {
      await ClassAttendance.registerAttendanceForToday(req.body.classId);
    }
    res.send({
      success: true,
      affectedRows: result
    });
    
  }

  async registerLateEntry(req, res) {
    const result = await StudentAttendance.registerLateEntry(req.body.studentId, req.user.ID);
    res.send({
      success: true,
      affectedRows: result.affectedRows
    });
  }

  async registerEarlyExit(req, res) {
    if(!req.body.studentId) {
      throw new Error('Missing or invalid studentId');
    }
    const student = await Student.findById(req.body.studentId);
    const date = moment().utc().format(db.getDateFormatString());
    const isAlreadyRegistered = await ClassAttendance.hasAttendanceBeenRegistered(student.ClassId, date);
    if (!isAlreadyRegistered) {
      throw new Error('Roll call has not been done yet today for selected class')
    }
    const result = await StudentAttendance.registerEarlyExit(req.body.studentId, req.user.ID);
    let response = {success: true};
    if (result.hasOwnProperty('id')) {
      response.id = result.id;
    } else {
      response.affectedRows = result.affectedRows;
    }
    res.send(response);
  }

  // GET teacher/attendance?classId=1&date=2019-12-09T00:00:00.000Z
  async getAttendance(req, res) {
    const isRegistered = await ClassAttendance.hasAttendanceBeenRegistered(req.query.classId, req.query.date);
    let result = {};
    if (!isRegistered) {
      result.rollCall = false;
      result.students = await Student.findByClassId(req.query.classId);
    } else {
      result.rollCall = true;
      result.students = await StudentAttendance.getDailyAttendanceByClassId(req.query.classId, req.query.date);
    }
    res.send(result);
  }

  // POST /teacher/assignment
  // Body: subjectId, classId, Title, Description, DueDate
  async addAssignment(req, res) {
    if(!await TCSR.checkIfTeacherTeachesSubjectInClass(
      req.user.ID,
      req.body.subjectId, 
      req.body.classId)
    ) {
      res.send(401);
      return;
    } 
    
    const result = await Assignment.addAssignment(
      req.body.subjectId,
      req.body.classId,
      req.body.title,
      req.body.description,
      req.body.dueDate
    );

    const assignmentId = result.id;

    if (req.files.length) {
      await this.addAttachmentsToAssignment(assignmentId, req.files);
    }

    res.send({success: true, id: assignmentId});
  }

  // PATCH /teacher/assignment
  // Body: classId, subjectId, assignmentId, title, description, dueDate
  async updateAssignment(req, res) {
    const teacherTeachesInClass = await TCSR.checkIfTeacherTeachesSubjectInClass(
      req.user.ID,
      req.body.subjectId, 
      req.body.classId,
    );

    const isAssignmentFromTeacher = await Assignment.checkIfAssignmentIsFromTeacher(req.body.assignmentId, req.user.ID);

    if(!teacherTeachesInClass || !isAssignmentFromTeacher) {
      res.send(401);
      return;
    } 

    const success = await Assignment.updateAssignment(
      req.body.assignmentId,
      req.body.title,
      req.body.description,
      req.body.dueDate
    );

    const attachments = JSON.parse(req.body.attachments);

    // update attachments
    await Assignment.updateAttachments(req.body.assignmentId, attachments || []);
    // add the new attachments
    if (req.files.length) {
      await this.addAttachmentsToAssignment(req.body.assignmentId, req.files);
    }

    res.send({ success });
  }

/* GET /teacher/assignments
 Query: classId, subjectId, dateRange, paging */
  async assignmentsByClassAndSubject(req, res) {
    if(!await TCSR.checkIfTeacherTeachesSubjectInClass(
      req.user.ID,
      req.query.subjectId,
      req.query.classId
    )) {
      res.send(401);
      return;
    }

    res.send(await Assignment.findByClassAndSubject(
      req.query.classId,
      req.query.subjectId,
      {from: req.query.fromDate, to: req.query.toDate},
      {page: req.query.page, pageSize: req.query.pageSize}
    ));
  }

  //DELETE /teacher/assignment
  //Body: ID
  async deleteAssignment(req, res) {
    if(!await Assignment.checkIfAssignmentIsFromTeacher(req.body.ID, req.user.ID)){
      res.send(401);
      return;
    }

    const attachments = await Assignment.getAttachments(req.body.ID);
    if (attachments.length) {
      await File.removeMany(attachments.map((a) => a.ID));
    }

    await Assignment.remove(req.body.ID);

    res.send({success: true});
  }

  async getAssignmentFile(req, res) {
    const fileKey = req.query.ID;
    if (!fileKey) {
      throw new Error("Missing or invalid file id");
    }
    
    const file = await File.findOne({ Key: fileKey });
    if (!file) {
      res.sendStatus(404);
      return;
    }

    const assignment = await Assignment.findOneByfile(file.ID);
    if (!assignment || !await Assignment.checkIfAssignmentIsFromTeacher(assignment.ID, req.user.ID)) {
      res.sendStatus(401);
      return;
    }

    const filePath = path.join(__dirname, "../../", "uploads", file.Key);
    if (!fs.existsSync(filePath)) {
      return res.sendStatus(404);
    }
    res.download(filePath);
  }

  /* GET /teacher/notes
  Query: classId, dateRange, paging */
  async getNotes(req, res) {
    if(!await TCSR.checkIfTeacherTeachesInClass(req.user.ID, req.query.classId)) {
      res.sendStatus(401);
      return;
    }
    res.send(await Note.findByClassId(
      req.query.classId,
      {from: req.query.fromDate, to: req.query.toDate},
      {page: req.query.page, pageSize: req.query.pageSize}
    ));
  }

  // POST /teacher/note
  // Body: Title, Description, StudentId, TeacherId, Date
  async addNote(req, res) {
    
    if(!await TCSR.checkIfTeacherTeachesToStudent(
      req.user.ID,
      req.body.studentId)
    ) {
      res.sendStatus(401);
      return;
    }

    await this.attendanceCheck(req.body.date, req.body.studentId);

    const result = await Note.addNote(
      req.body.title,
      req.body.description,
      req.body.studentId,
      req.user.ID,
      req.body.date,
    );
    res.send({success: true, id: result.id});
  }

  // PATCH /teacher/note
  // Body: noteId, title, description, date
  async updateNote(req, res) {

    const isNoteFromTeacher = await Note.checkIfNoteIsFromTeacher(
      req.body.noteId,
      req.user.ID
    );

    if(!isNoteFromTeacher) {
      res.sendStatus(401);
      return;
    }

    await this.attendanceCheck(req.body.date, req.body.studentId);

    const success = await Note.updateNote(
      req.body.noteId,
      req.body.title,
      req.body.description,
      req.body.date 
    );
    res.send({ success });
  }

  //DELETE /teacher/note
  //Body: ID
  async deleteNote(req, res) {
    if(!await Note.checkIfNoteIsFromTeacher(req.body.ID, req.user.ID)){
      res.sendStatus(401); 
      return;
    }

    await Note.remove(
      req.body.ID
    );

    res.send({success: true});
  }

  // GET /teacher/support-material
  // Query: subject (optional), fromDate (optional), toDate (optional), page (optional), pageSize (optional)
  async getSupportMaterial(req, res) {
    const supportMaterial = await SupportMaterial.findAllByTeacher(
      req.user.ID,
      { subject: req.query.subject, classId: req.query.classId, from: req.query.fromDate, to: req.query.toDate },
      { page: req.query.page, pageSize: req.query.pageSize }
    );

    res.send({ supportMaterial: supportMaterial });
  }

  // POST /teacher/support-material
  // Body: subjectId, file
  async addSupportMaterial(req, res) {
    const supportMaterialId = await SupportMaterial.add(
      req.user.ID,
      req.body.subjectId,  
      req.body.classId,
      req.file
    );

    res.send({ supportMaterialId });
  }

  // DELETE /teacher/support-material
  // Body: ID
  async deleteSupportMaterial(req, res) {
    await SupportMaterial.remove(req.user.ID, req.body.ID);
    res.send({ success: true });
  }

  async getSupportFile(req, res) {
    const fileKey = req.query.ID;
    if (!fileKey) {
      throw new Error("Missing or invalid file id");
    }
    
    const file = await File.findOne({ Key: fileKey });
    if (!file) {
      res.sendStatus(404);
      return;
    }

    const support = await SupportMaterial.findOne({ FileId: file.ID });
    if (!support) {
      return res.sendStatus(404);
    }

    const relation = await TCSR.findById(support.TeacherSubjectClassRelationId);
    if (!relation) {
      return res.sendStatus(401);
    }

    if (relation.TeacherId !== req.user.ID) {
      return res.sendStatus(401);
    }

    const filePath = path.join(__dirname, "../../", "uploads", fileKey);
    if (!fs.existsSync(filePath)) {
      return res.sendStatus(404);
    }
    
    res.download(filePath);
  }
}

export default new TeacherController();
