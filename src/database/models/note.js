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
        query =`SELECT DISTINCT N.ID, N.Title, N.Description, N.Date, N.IsSeen, S.FirstName, S.LastName
        FROM Notes N, Students S, TeacherSubjectClassRelation tscr
        WHERE N.StudentId = S.ID AND N.TeacherId = tscr.TeacherId AND
        tscr.ClassId = ? AND N.Date >= ? AND N.Date <= ?
        ORDER BY N.Date DESC`;
    } else {
        query =`SELECT DISTINCT N.ID, N.Title, N.Description, N.Date, N.IsSeen, S.FirstName, S.LastName
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

    if (!insertDate.isValid() || dayOfWeek == 7) {
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
  
}
export default new Note();