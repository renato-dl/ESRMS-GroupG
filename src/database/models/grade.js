import {Model} from './base';

class Grade extends Model {
  constructor() {
    super('Grades');
  }
  async findByStudentId(studentId) {
    const connection = await this.db.getConnection();
    const results = await connection.query(
        `SELECT Subjects.Name, Grade, Date
        FROM ${this.tableName}, Subjects
        WHERE ${this.tableName}.SubjectId = Subjects.ID AND StudentId = ?
        ORDER BY Date DESC`,
        [studentId]
    );
    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }

    return results;
  }
}

export default new Grade();