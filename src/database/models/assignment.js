import {Model} from './base';
import moment from 'moment';

class Assignment extends Model {
  constructor() {
    super('Assignments');
  }

  async findByStudentId(studentId, dateRange, pagination) {
    if (!studentId) throw new Error('Missing or invalid student id');
    
    const connection = await this.db.getConnection();
    let query;

    if (dateRange.from && dateRange.to) {
        query =`SELECT A.ID, SU.Name, A.Title, A.Description, A.DueDate  
        FROM Assignments A, Students ST, Subjects SU
        WHERE A.ClassId = ST.ClassId AND A.SubjectId = SU.ID AND ST.ID = ?
        AND A.DueDate >= ? AND A.DueDate <= ?
        ORDER BY A.DueDate`;
    } else {
        query =`SELECT A.ID, SU.Name, A.Title, A.Description, A.DueDate  
            FROM Assignments A, Students ST, Subjects SU
            WHERE A.ClassId = ST.ClassId AND A.SubjectId = SU.ID AND ST.ID = ?
            ORDER BY A.DueDate`;
    }
    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query,  [studentId, dateRange.from, dateRange.to]);

    connection.release();

    if (!results.length) {
      throw new Error('There are no assignments for the chosen student!');
    }
    return results;
  }
  async addAssignment(subjectId, classId, title, description, dueDate, filename){

    if (!subjectId) {
      throw new Error('Missing or invalid subject id');
    }

    if (!classId) {
      throw new Error('Missing or invalid class id');
    }
    
    if (!title) {
      throw new Error('Missing or invalid title');
    }

    if (!description) {
      throw new Error('Missing or invalid description');
    }

    if (!dueDate) {
      throw new Error('Missing or invalid due date');
    }

    const date = moment.utc(dueDate);
    const dayOfWeek = moment.utc(dueDate).isoWeekday();

    if (!date.isValid() || dayOfWeek == 7) {
      throw new Error('Invalid assignment date');
    }

    if (!date.isAfter(moment().utc(), 'day')) {
      throw new Error('Invalid assignment due date');
    }

    const result = await this.create({
      SubjectId: subjectId,
      ClassId: classId,
      Title: title,
      Description: description,
      DueDate: date.format(this.db.getDateFormatString()),
      AttachmentFile: filename
    });

    return {
      id: result
    }

  }

  updateAssignment(assId, title, description, dueDate, filename) {
    if (!assId) {
      throw new Error('Missing or invalid assignment id');
    }
    if (!title) {
      throw new Error('Missing or invalid title');
    }
    if (!description) {
      throw new Error('Missing or invalid description');
    }
    if(!dueDate){
      throw new Error('Missing or invalid due date');
    }

    const date = moment.utc(dueDate);
    const dayOfWeek = moment.utc(dueDate).isoWeekday();

    if (!date.isValid() || dayOfWeek == 7) {
      throw new Error('Invalid assignment due date');
    }

    if (!date.isAfter(moment().utc(), 'day')) {
      throw new Error('Invalid assignment due date');
    }

    return this.update(assId, {
        Title: title,
        Description: description,
        DueDate: date.format(this.db.getDateFormatString()),
        AttachmentFile: filename
      })
  }

  async findByClassAndSubject(classId, subjectId, dateRange, pagination) {
    if (!classId) throw new Error('Missing or invalid class id');
    if (!subjectId) throw new Error('Missing or invalid subject id');
    
    const connection = await this.db.getConnection();
    let query;

    if (dateRange.from && dateRange.to) {
        query =`SELECT ID, Title, Description, DueDate, AttachmentFile
        FROM Assignments
        WHERE ClassId = ? AND SubjectId = ?
        AND DueDate >= ? AND DueDate <= ?
        ORDER BY DueDate`;
    } else {
        query =`SELECT ID, Title, Description, DueDate, AttachmentFile  
        FROM Assignments
        WHERE ClassId = ? AND SubjectId = ?
        ORDER BY DueDate`;
    }
    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query,  [classId, subjectId, dateRange.from, dateRange.to]);
    connection.release();

    if (!results.length) {
      return [];
    }
    return results;
  }
  async checkIfAssignmentIsFromTeacher(assId, teacherId) {
    if (!assId) throw new Error('Missing or invalid assignment id');
    if (!teacherId) throw new Error('Missing or invalid teacher id');

    const connenction = await this.db.getConnection();
    const result = await connenction.query(
      `SELECT COUNT(*) AS count
      FROM Assignments A, TeacherSubjectClassRelation tscr
      WHERE A.ClassId = tscr.ClassId
      AND tscr.SubjectId = A.SubjectId
      AND tscr.TeacherId = ? AND A.ID = ?`,
      [teacherId, assId]
    );
    connenction.release();
    if (result[0].count == 1) {
      return true;
    }
    return false;
  }
}
export default new Assignment();