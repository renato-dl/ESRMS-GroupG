import {Model} from './base';
import moment from 'moment';

class Note extends Model {
  constructor() {
    super('Notes');
  }

  async findByClassId(classId, dateRange, pagination) {
    if (!classId) throw new Error('Missing or invalid class id');
    
    const connection = await this.db.getConnection();
    let query;

    if (dateRange.from && dateRange.to) {
        query =`SELECT DISTINCT N.ID, N.Title, N.Description, N.Date, N.IsSeen, N.StudentId, S.FirstName, S.LastName
        FROM Notes N, Students S, TeacherSubjectClassRelation tscr
        WHERE N.StudentId = S.ID AND N.TeacherId = tscr.TeacherId AND
        tscr.ClassId = ? AND N.Date >= ? AND N.Date <= ?
        ORDER BY N.Date DESC`;
    } else {
        query =`SELECT DISTINCT N.ID, N.Title, N.Description, N.Date, N.IsSeen, N.StudentId, S.FirstName, S.LastName
        FROM Notes N, Students S,  TeacherSubjectClassRelation tscr
        WHERE N.StudentId = S.ID AND N.TeacherId = tscr.TeacherId AND tscr.ClassId = ?
        ORDER BY N.Date DESC`;
    }
    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query,  [classId, dateRange.from, dateRange.to]);

    connection.release();

    if (!results.length) {
      return {message: "Entity not found"};
    }
    return results;
  }

  async addNote(title, description, studentId, teacherId, date){

    if (!title) {
      throw new Error('Missing or invalid title');
    }
    
    if (!description) {
      throw new Error('Missing or invalid description');
    }

    if (!studentId) {
      throw new Error('Missing or invalid student id');
    }

    if (!teacherId) {
      throw new Error('Missing or invalid teacher id');
    }

    if (!date) {
      throw new Error('Missing or invalid note date');
    }

    const insertDate = moment.utc(date);
    const dayOfWeek = moment.utc(date).isoWeekday();

    if (!insertDate.isValid() || dayOfWeek == 6 || dayOfWeek == 7 ) {
      throw new Error('Invalid note date');
    }

    if (insertDate.isAfter(moment().utc(), 'day')) {
      throw new Error('Invalid note date');
    }

    const result = await this.create({
      Title: title,
      Description: description,
      StudentId: studentId,
      TeacherId: teacherId, 
      Date: insertDate.format(this.db.getDateFormatString()),
  
    });

    return {
      id: result
    }

  }

  async findByStudentId(studentId) {
    if (!studentId) {
      throw new Error('Missing or invalid studentId');
    }
    const query = `
      SELECT N.ID, N.Title, N.Date, N.IsSeen, U.LastName, U.FirstName 
      FROM ${this.tableName} N, Users U
      WHERE N.TeacherId = U.ID AND N.StudentId = ?
    `;
    let result;
    const connection = await this.db.getConnection();
    try {
      result = await connection.query(query, studentId);
    } catch (error) {
      console.log(error);
    } finally {
      connection.release();
    }
    return result;
  }
  updateNote(noteId, title, description, date) {

    if (!noteId) {
      throw new Error('Missing or invalid note id');
    }

    if (!title) {
      throw new Error('Missing or invalid title');
    }
    if (!description) {
      throw new Error('Missing or invalid description');
    }
    if(!date){
      throw new Error('Missing or invalid note date');
    }

    const updateDate = moment.utc(date);
    const dayOfWeek = moment.utc(updateDate).isoWeekday();

    if (!updateDate.isValid() || dayOfWeek == 6 || dayOfWeek == 7) {
      throw new Error('Invalid note date');
    }

    if (updateDate.isAfter(moment().utc(), 'day')) {
      throw new Error('Invalid note date');
    }

    return this.update(noteId, {
        Title: title,
        Description: description,
        Date: updateDate.format(this.db.getDateFormatString()),
        IsSeen: false
      })
  }



  async checkIfNoteIsFromTeacher(noteId, teacherId) {

    if (!noteId) throw new Error('Missing or invalid note id');
    if (!teacherId) throw new Error('Missing or invalid teacher id');

    const connenction = await this.db.getConnection();
    const result = await connenction.query(
      `SELECT COUNT(*) AS count
      FROM Notes
      WHERE ID = ? AND TeacherId = ?`,
      [noteId, teacherId]
    );
    connenction.release();
    if (result[0].count == 1) {
      return true;
    }
    return false;
  }

  
}

export default new Note();
