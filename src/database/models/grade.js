import {Model} from './base';

class Grade extends Model {
  constructor() {
    super('Grades');
  }
  async findByStudentId(parentId, studentId) {
    const connection = await this.db.getConnection();
    const results = await connection.query(
        `SELECT Subjects.Name, Grade, Date
        FROM ${this.tableName}, Subjects, Students
        WHERE
          ${this.tableName}.SubjectId = Subjects.ID AND
          ${this.tableName}.StudentId = Student.ID AND
          StudentId = ? AND
          (Parent1 = ? OR Parent2 = ?)
        ORDER BY Date DESC`,
        [studentId, parentId, parentId]
    );
    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }

    return results;
  }
}

export default new Grade();