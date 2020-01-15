import {Model} from './base';

class Subject extends Model {
  constructor() {
    super('Subjects');
  }

  async findByTeacherId(teacherId) {
    if (!teacherId) throw new Error('Missing or invalid teacher id');
    try{
      const connection = await this.db.getConnection();
      const sql_query = `select s.*, tscr.classid 
      from TeacherSubjectClassRelation tscr, ${this.tableName} s
      where tscr.TeacherId = ? and tscr.SubjectId = s.ID ;`;
      const results = await connection.query(sql_query, [teacherId]);

      connection.release();

      if (!results.length) {
        throw new Error('Entity not found');
      }

      return results;
    }
    catch(e){
      console.log(e);
      throw e;
    }    
  }

  async findByStudentId(studentId) {
    if (!studentId) throw new Error('Missing or invalid student id');

    const connection = await this.db.getConnection();
    let query =
        `SELECT Sub.ID, Sub.Name
        FROM TeacherSubjectClassRelation tscr, Subjects Sub, Students Stu
        WHERE
          Stu.ClassId = tscr.ClassId AND tscr.SubjectId = Sub.ID AND
          Stu.ID = ?
        ORDER BY Sub.Name`;

    const results = await connection.query(query, [studentId]);

    connection.release();

    if (!results.length) {
      return {message: "Entity not found"};
    }

    return results;
  }

  
}

export default new Subject();