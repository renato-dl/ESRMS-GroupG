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
    if (!topicTitle) {
      throw new Error('Missing or invalid topic title');
    }
    if (!topicDate) {
      throw new Error('Missing or invalid topic date');
    }

    const date = moment.utc(topicDate);
    const now = moment().utc();
    const lastMonday = moment().utc().day(1);

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
      [selectResult[0].id, topicTitle, topicDescription, date.format('YYYY-MM-DD HH:mm:ss')]
    );

    connection.release();

    if (insertResult.affectedRows != 1) {
      throw new Error('Operation failed');
    }

    return {id: insertResult.insertId};
  }

  async editTopic(/* PARAMS*/) {
    // @Xileny
  }

  async findByTeacherClassSubject(teacherId, classId, subjectId, pagination) {
    const connection = await this.db.getConnection();
    let sql_query = `SELECT t.Title, t.TopicDescription, t.TopicDate 
    FROM TeacherSubjectClassRelation tscr, Topics t
    WHERE tscr.SubjectId = t.SubjectId AND tscr.TeacherId = ? AND tscr.ClassId = ? AND tscr.SubjectId = ? 
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
}
 

export default new Topic();