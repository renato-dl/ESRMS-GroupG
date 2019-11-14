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
    if (!topicDescription) {
      throw new Error('Missing or invalid topic description');
    }
    if (!topicDate) {
      throw new Error('Missing or invalid topic date');
    }

    const date = moment(topicDate);
    const now = moment();
    const lastMonday = moment().day(1);

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
      `SELECT COUNT(*) AS count
      FROM TeacherSubjectClassRelation
      WHERE SubjectId = ? AND TeacherId = ? AND ClassId = ?;`,
      [subjectId, teacherId, classId]
    );

    if(selectResult[0].count != 0) {
      throw new Error('Unauthorized');
    };

    const insertResult = await connection.query(
      `INSERT INTO ${this.tableName} (SubjectId, ClassId, Title, TopicDescription, TopicDate)
      VALUES (?, ?, ?, ?, ?);`,
      [subjectId, classId, topicTitle, topicDescription, date.format('YYYY-MM-DD')]
    );

    connection.release();

    // @Renato
    if (insertResult.affectedRows != 1) {
      throw new Error('Operation failed');
    }

    return {id: insertResult.insertId};
  }

  async editTopic(/* PARAMS*/) {
    // @Xileny
  }

  async findByTeacherClassSubject(/* PARAMS*/) {
    // @Xhoi, good luck
  }

}

export default new Topic();