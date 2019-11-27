import {Model} from './base';

class Grade extends Model {
  constructor() {
    super('Grades');
  }
  async findByStudentId(studentId, pagination) {
    if (!studentId) throw new Error('Missing or invalid student id');

    const connection = await this.db.getConnection();
    let query =
        `SELECT Subjects.Name, Grade, GradeDate, Type
        FROM ${this.tableName}, Subjects, Students
        WHERE
          ${this.tableName}.SubjectId = Subjects.ID AND
          ${this.tableName}.StudentId = Students.ID AND
          StudentId = ?
        ORDER BY GradeDate DESC`;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query, [studentId]);

    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }

    return results;
  }

  async findByClassAndSubject(classId, subjectId, pagination) {

    if (!classId) throw new Error('Missing or invalid class id');
    if (!subjectId) throw new Error('Missing or invalid subject id');

    const connection = await this.db.getConnection();
    let query =
        `SELECT FirstName, LastName, Grade, GradeDate, Type
        FROM ${this.tableName}, Students
        WHERE
          ${this.tableName}.StudentId = Students.ID AND
          ClassId = ? AND SubjectId = ?
        ORDER BY GradeDate DESC`;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query, [classId, subjectId]);

    connection.release();
    
    return results;
  }
}

export default new Grade();