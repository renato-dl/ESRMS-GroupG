import {Model} from './base';

class Grade extends Model {
  constructor() {
    super('Grades');
  }
  async findByStudentId(parentId, studentId, pagination) {
    const connection = await this.db.getConnection();
    let query =
        `SELECT Subjects.Name, Grade, GradeDate
        FROM ${this.tableName}, Subjects, Students
        WHERE
          ${this.tableName}.SubjectId = Subjects.ID AND
          ${this.tableName}.StudentId = Students.ID AND
          StudentId = ? AND
          (Parent1 = ? OR Parent2 = ?)
        ORDER BY GradeDate DESC`;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query, [studentId, parentId, parentId]);

    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }

    return results;
  }
}

export default new Grade();