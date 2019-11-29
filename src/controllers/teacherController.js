import {BaseController} from "./baseController";
import Subject from "../database/models/subject";
import Topic from '../database/models/topic';
import Class from '../database/models/class';
import TCSR from '../database/models/teacherClassSubject';
import Grade from '../database/models/grade';

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

  async gradesByClassAndSubject(req, res) {
    if(!await TCSR.checkIfTeacherTeachesSubjectInClass(
      req.user.ID,
      req.query.subjectId,
      req.query.classId
    )) {
      res.send(401);
      return;
    }
    res.send(await Grade.findByClassAndSubject(req.query.classId, req.query.subjectId))
  }


  // POST /teacher/grade
  // Body: classId, subjectId, studentId, grade, type
  async addGrade(req, res) {
    if(!await TCSR.checkIfTeacherTeachesSubjectInClass(
      req.user.ID,
      req.body.subjectId, 
      req.body.classId)){
        res.send(401);
        return;
    } 
    const result = await Grade.addGrade(
      req.body.subjectId,
      req.body.studentId,
      req.body.grade,
      req.body.type
     );
    res.send({success: true, id: result.id});
  }

  async deleteGrade(req, res) {
    if(!await Grade.checkIfGradeIsFromTeacher(req.body.ID, req.user.ID)){
        res.send(401);
        return;
    } 
    const result = await Grade.remove(
      req.body.ID
     );
    res.send({success: true});
  }
}

export default new TeacherController();
