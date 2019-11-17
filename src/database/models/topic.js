import {Model} from './base';
import moment from 'moment';

class Topic extends Model {
  constructor() {
    super('Topics');
  }

  async insertNewTopic(teacherId, classId, subjectId, topicTitle, topicDescription, topicDate) {

    //Data validation
    if (!classId) {
      throw new Error('Missing or invalid class id');
    }
    if (!subjectId) {
      throw new Error('Missing or invalid subject id');
    }
    const dataValidation = await this.validateTopicData(topicTitle, topicDate);
    if (!dataValidation){
      throw new Error("Data for topic not valid!");
    }
    if (!topicDescription) {
      topicDescription = '';
    }
    if (!topicDate) {
      throw new Error('Missing or invalid topic date');
    }

    const date = moment.utc(topicDate);
    
    const connection = await this.db.getConnection();

    const selectResult = await connection.query(
      `SELECT ID AS id
      FROM TeacherSubjectClassRelation
      WHERE SubjectId = ? AND TeacherId = ? AND ClassId = ?;`,
      [subjectId, teacherId, classId]
    );

    if(selectResult.length != 1) {
      throw new Error('Unauthorized');
    };

    const insertResult = await connection.query(
      `INSERT INTO ${this.tableName} (TeacherSubjectClassRelationId, Title, TopicDescription, TopicDate)
      VALUES (?, ?, ?, ?);`,
      [selectResult[0].id, topicTitle, topicDescription, date.format(this.db.getDateTimeFormatString())]
    );

    connection.release();

    if (insertResult.affectedRows != 1) {
      throw new Error('Operation failed');
    }

    return {id: insertResult.insertId};
  }

  async editTopic(teacherId, topicId, topicTitle, topicDescription, topicDate) {
    const editTopicResult = {};
    try{      
      const connection = await this.db.getConnection();
      // validate teacher
      const teacherValidation = await this.validateTeacherForTopicUpdate(teacherId, topicId);
      if(!teacherValidation){
        editTopicResult["Success"] = false;
        editTopicResult["Message"] = "Teacher is not authorized!";
        return editTopicResult;
      }
      // validate data
      const validationResult = await this.validateTopicData(topicTitle, topicDate);
      if(!validationResult){
        editTopicResult["Success"] = false;
        editTopicResult["Message"] = "Data for topic not valid!";
        return editTopicResult;
      }

      if (!topicDescription) {
        topicDescription = '';
      }

      const date = moment.utc(topicDate);
      const updateResult = await connection.query(
        `update ${this.tableName} 
        set Title = ?, TopicDescription = ?, TopicDate = ?
        where id = ?;`,
        [topicTitle, topicDescription, date.format(this.db.getDateTimeFormatString()), topicId]
      );
      connection.release();
      if (updateResult.affectedRows != 1) {
        editTopicResult["Success"] = false;
        editTopicResult["Message"] = "Something went wrong.";
        return editTopicResult;
      }
      editTopicResult["Success"] = true;
      return editTopicResult;
    }
    catch(e){
      console.log(e);
      editTopicResult["Success"] = false;
      editTopicResult["Message"] = e.message;
      return editTopicResult;
    }
  }

  async findByTeacherClassSubject(teacherId, classId, subjectId, pagination) {
    const connection = await this.db.getConnection();
    let sql_query = `SELECT t.ID, t.Title, t.TopicDescription, t.TopicDate 
    FROM TeacherSubjectClassRelation tscr, Topics t
    WHERE tscr.ID = t.TeacherSubjectClassRelationId AND tscr.TeacherId = ? AND tscr.ClassId = ? AND tscr.SubjectId = ? 
    ORDER BY t.TopicDate DESC`;
 
    if (pagination) {
      sql_query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(sql_query, [teacherId, classId, subjectId]);

    connection.release();
    if (!results.length) {
      throw new Error('Entity not found');
    }
      return results;
    }

  async validateTopicData(topicTitle, topicDate){
    try{
      if (!topicTitle) {
        throw new Error('Missing or invalid topic title');
      }
      if (!topicDate) {
        throw new Error('Missing or invalid topic date');
      }
  
      const date = moment.utc(topicDate);
      const now = moment().utc();
      const lastMonday = moment().utc().day(moment().utc().day() >= 1 ? 1 :-6);
  
      if (!date.isValid()) {
        throw new Error('Invalid topic date');
      } 
  
      // lastMonday <= date <= today
  
      if (date.isBefore(lastMonday, 'day')) {
        throw new Error('Only topics taught in the current week can be inserted');
      }
  
      if (date.isAfter(now, 'day')) {
        throw new Error('Future topics cannot be inserted');
      }
  
      return true;
    }
    catch(e){
      console.log(e);
      throw e;
    }    
  }

  async validateTeacherForTopicUpdate(teacherId, topicId){
    try{
      if(!topicId){
        throw new Error("Topic id is missing.");
      }
      const connection = await this.db.getConnection();
      const result = await connection.query(
        `select tscr.TeacherId from TeacherSubjectClassRelation tscr, Topics t 
        where t.ID = ? and t.TeacherSubjectClassRelationId = tscr.ID ;`,
        [topicId]
      );
      connection.release();
      if (!result.length) {
        throw new Error('Teacher id not found');
      }
      if (result[0] && result[0]["TeacherId"] == teacherId){
        return true;
      }
      return false;
    }
    catch(e){
      console.log(e);
      throw e;
    }
  }
}
 

export default new Topic();