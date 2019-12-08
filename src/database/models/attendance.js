import {Model} from './base';
import user from './user';

class AttendanceRegistry extends Model {
  constructor() {
    super('AttendanceRegistry');
  }

  async findByStudentId(studentId, dateRange) {
    if (!studentId) {
      throw new Error('Missing or invalid studentId');
    }
    let query = `
      SELECT
        ID,      
        Date,
        LateEntry,
        EntryTeacherId,
        EarlyExit,
        ExitTeacherId
      FROM ${this.tableName}
      WHERE StudentId = ? 
    `;
    if (dateRange.from && dateRange.to) {
      query += ' AND Date BETWEEN ? AND ? ';
    }
    query += 'ORDER BY Date'
    const connection = await this.db.getConnection();
    let params;
    if (dateRange.from && dateRange.to) {
      params = [studentId, dateRange.from, dateRange.to];
    } else {
      params = [studentId];
    }
    const results = await connection.query(query, params);
    connection.release();

    await Promise.all(results.map(async element =>{
      let newElement = element;
      if(element.EntryTeacherId) {
        const teacher = await user.findById(element.EntryTeacherId);
        newElement.EntryTeacherName = teacher.FirstName + ' ' + teacher.LastName;
      }
      if(element.ExitTeacherId) {
        const teacher = await user.findById(element.ExitTeacherId);
        newElement.ExitTeacherName = teacher.FirstName + ' ' + teacher.LastName;
      }
      return newElement;
    }));

    return results;
  }
}

export default new AttendanceRegistry();