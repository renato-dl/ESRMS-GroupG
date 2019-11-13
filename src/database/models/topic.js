import {Model} from './base';

class Topic extends Model {
  constructor() {
    super('Topics');
  }

  async insertNewTopic(/* PARAMS*/) {
    const connection = await this.db.getConnection();
    const results = await connection.query(/* @Renato */);

    connection.release();

    // @Renato
    if (!results.length) {
      throw new Error();
    }

    return results;
  }

  async editTopic(/* PARAMS*/) {
    // @Xileny
  }

  async findByTeacherClassSubject(teacherId, classId, subjectId, page, pageSize) {
    try{
    const connection = await this.db.getConnection();
    let sql_query = `SELECT t.SubjectId, t.Title, t.TopicDate 
    FROM teachersubjectclassrelation tscr, topics t
    WHERE tscr.SubjectId = t.SubjectId AND tscr.TeacherId = ? AND tscr.ClassId = ? AND tscr.SubjectId = ? 
    ORDER BY CreatedOn DESC;`;
 
    const results = await connection.query(sql_query, [teacherId, classId, subjectId]);
    connection.release();
    if (!results.length) {
      throw new Error('Entity not found');
    }
      return results;
  }catch(e){
      console.log(e);
      throw e;
  }
}
}
 

export default new Topic();