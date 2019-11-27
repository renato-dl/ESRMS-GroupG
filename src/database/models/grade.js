import {Model} from './base';

class Grade extends Model {
  constructor() {
    super('Grades');
  }
  async findByStudentId(parentId, studentId, pagination) {
    const connection = await this.db.getConnection();
    let query =
        `SELECT Subjects.Name, Grade, GradeDate, Type
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
  async addGrade(classId, subjectId, studentId, grade, type){

    if (!classId) {
      throw new Error('Missing or invalid class id');
    }
    if (!subjectId) {
      throw new Error('Missing or invalid subject id');
    }

    if (!studentId) {
      throw new Error('Missing or invalid student id');
    }

    if (!grade) {
      throw new Error('Missing or invalid grade');
    }

    if (!type) {
      throw new Error('Missing or invalid type');
    }

    //add grade
    const result = await this.create({
      ClassId: classId,
      SubjectId: subjectId,
      StudentId: studentId,
      Grade: grade,
      Type: type
    });

    return {
      id: result.id
    }
  }
}

export default new Grade();