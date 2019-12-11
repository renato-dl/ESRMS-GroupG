import {Model} from './base';
import moment from 'moment';

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
  async addGrade(subjectId, studentId, grade, gradeDate, type){

    if (!subjectId) {
      throw new Error('Missing or invalid subject id');
    }

    if (!studentId) {
      throw new Error('Missing or invalid student id');
    }

    const parsedGrade = parseFloat(grade);
    if(isNaN(parsedGrade)){
      throw new Error('Missing or invalid grade');
    }
    if ( parsedGrade < 0 || parsedGrade > 10 ) {
      throw new Error('Invalid grade');
    }
    if((parsedGrade * 100) % 25 != 0){
      throw new Error('Invalid grade');
    }
    if (!gradeDate) {
      throw new Error('Missing or invalid grade date');
    }
    if (!type) {
      throw new Error('Missing or invalid type');
    }

    const date = moment.utc(gradeDate);
    const dayOfWeek = moment.utc(gradeDate).isoWeekday();

    if (!date.isValid() || dayOfWeek == 7) {
      throw new Error('Invalid grade date');
    }

    if (date.isAfter(moment().utc(), 'day')) {
      throw new Error('Future grade date');
    }
    //add grade
    const result = await this.create({
      SubjectId: subjectId,
      StudentId: studentId,
      Grade: grade,
      GradeDate: date.format(this.db.getDateFormatString()),
      Type: type
    });

    return {
      id: result
    }
  }

  async findByClassAndSubject(classId, subjectId, pagination) {

    if (!classId) throw new Error('Missing or invalid class id');
    if (!subjectId) throw new Error('Missing or invalid subject id');

    const connection = await this.db.getConnection();
    let query =
        `SELECT ${this.tableName}.ID, ${this.tableName}.StudentId, FirstName, LastName, Grade, GradeDate, Type
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

  async checkIfGradeIsFromTeacher(gradeId, teacherId) {
    if (!gradeId) throw new Error('Missing or invalid grade id');
    if (!teacherId) throw new Error('Missing or invalid teacher id');

    const connenction = await this.db.getConnection();
    const result = await connenction.query(
      `SELECT COUNT(*) AS count
      FROM Grades g, TeacherSubjectClassRelation tscr, Students s
      WHERE s.ClassId = tscr.ClassId
      AND tscr.SubjectId = g.SubjectId
      AND g.StudentId = s.ID
      AND tscr.TeacherId = ?
      AND g.ID = ?`,
      [teacherId, gradeId]
    );
    connenction.release();
    if (result[0].count == 1) {
      return true;
    }
    return false;
  }

  updateGrade(ID, Grade, Type) {
    if (!ID) {
      throw new Error('Missing or invalid grade id');
    }

    const parsedGrade = parseFloat(Grade);
    
    if(isNaN(parsedGrade)){
      throw new Error('Missing or invalid grade');
    }
    if ( parsedGrade < 0 || parsedGrade > 10 ) {
      throw new Error('Invalid grade');
    }
    if((parsedGrade * 100) % 25 != 0){
      throw new Error('Invalid grade');
    }
    if (!Type) {
      throw new Error('Missing or invalid type');
    }

    return this.update(ID, {Grade, Type})
  }

}

export default new Grade();