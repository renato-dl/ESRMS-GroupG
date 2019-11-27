import {Model} from './base';

class Assignment extends Model {
  constructor() {
    super('Assignments');
  }

  async findByStudentId(studentId, pagination) {
    if (!studentId) throw new Error('Missing or invalid student id');

    const connection = await this.db.getConnection();
    let query =
        `SELECT *
        FROM ${this.tableName}, Students
        WHERE
          ${this.tableName}.ClassId = Students.ClassId AND
          AND StudentId = ?
        ORDER BY DueDate`;

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
export default new Assignment();