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
  async addAssignment(subjectId, classId, title, description, dueDate){

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
    console.log(date);
    if (!date.isValid()) {
      throw new Error('Invalid assignment date');
    }

    if (date.isBefore(moment().utc(), 'day')) {
      throw new Error('Past assignment due date');
    }

    const result = await this.create({
      SubjectId: subjectId,
      ClassId: classId,
      Title: title,
      Description: description,
      DueDate: date.format(this.db.getDateFormatString())
    });

    return {
      id: result
    }

  }
  async findByClassAndSubject(classId, subjectId, dateRange, pagination) {
    if (!classId) throw new Error('Missing or invalid class id');
    if (!subjectId) throw new Error('Missing or invalid subject id');
    
    const connection = await this.db.getConnection();
    let query;

    if (dateRange.from && dateRange.to) {
        query =`SELECT ID, Title, Description, DueDate  
        FROM Assignments
        WHERE ClassId = ? AND SubjectId = ?
        AND DueDate >= ? AND DueDate <= ?
        ORDER BY A.DueDate`;
    } else {
        query =`SELECT ID, Title, Description, DueDate  
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
}
export default new Assignment();