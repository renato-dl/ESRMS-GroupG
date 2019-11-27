import {Model} from './base';

class Grade extends Model {
  constructor() {
    super('Grades');
  }
  async findByStudentId(studentId, pagination) {
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
}

export default new Grade();