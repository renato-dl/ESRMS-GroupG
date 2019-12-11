import {BaseController} from "./baseController";
import Subject from "../database/models/subject";
import Topic from '../database/models/topic';
import Class from '../database/models/class';
import TCSR from '../database/models/teacherClassSubject';
import Grade from '../database/models/grade';
import Student from '../database/models/student';
import StudentAttendance from '../database/models/studentAttendance';
import ClassAttendance from '../database/models/classAttendance';
import Assignment from '../database/models/assignment';

class TeacherController extends BaseController {

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
  // Body: classId, subjectId, studentId, grade, type
  async addGrade(req, res) {
    if(!await TCSR.checkIfTeacherTeachesSubjectInClass(
      req.user.ID,
      req.body.subjectId, 
      req.body.classId)
      ){
        res.send(401);
        return;
    } 
    const result = await Grade.addGrade(
      req.body.subjectId,
      req.body.studentId,
      req.body.grade,
      req.body.gradeDate,
      req.body.type
     );
    res.send({success: true, id: result.id});
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

  async registerBulkAbsence(req, res) {
    if (!req.body.students) {
      throw new Error('Missing students array');
    }
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
    const result = await StudentAttendance.registerBulkAbsence(
      req.body.students,
      req.user.ID
    );
    res.send({
      success: true,
      affectedRows: result.affectedRows
    });
  }

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
      ){
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
    res.send({success: true, id: result.id});
  }

  // PATCH /teacher/assignment
  // Body: classId, subjectId, assignmentId, title, description, dueDate
  async updateAssignment(req, res) {
    const teacherTeachesInClass = await TCSR.checkIfTeacherTeachesSubjectInClass(
      req.user.ID,
      req.body.subjectId, 
      req.body.classId
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
    await Assignment.remove(
      req.body.ID
    );

    res.send({success: true});
  }
}

export default new TeacherController();
