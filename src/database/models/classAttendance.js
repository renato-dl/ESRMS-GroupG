import {Model} from './base';
import moment from 'moment';

class ClassAttendance extends Model {
  constructor() {
    super('ClassAttendance');
  }

  async hasAttendanceBeenRegistered(classId, date) {

    if (!classId) {
      throw new Error('Missing or invalid ClassId');
    }
    if (!date) {
      throw new Error('Missing or invalid date');
    }
    const dateObj = moment.utc(date);
    if (!dateObj.isValid()) {
      throw new Error('Invalid date');
    }
    const dateStr = dateObj.format(this.db.getDateFormatString());
    
    const query = `
      SELECT COUNT(*) AS count
      FROM ${this.tableName}
      WHERE ClassId = ? AND Date = ?
    `;
    let result;
    const connection = await this.db.getConnection();
    try {
      result = await connection.query(query, [classId, dateStr]);
    } catch (error) {
      console.log(error);
    } finally {
      connection.release();
    }
    if (result[0].count != 0) {
      return true;
    }
    return false;
  }

  async registerAttendanceForToday(classId) {
    if (!classId) {
      throw new Error('Missing or invalid classId');
    }
    const date = moment().utc().format(this.db.getDateFormatString());
    const isAlreadyRegistered = await this.hasAttendanceBeenRegistered(classId, date);
    if (isAlreadyRegistered) {
      throw new Error('Attendance already registered for specified class and date');
    }
    const result = await this.create({
      ClassId: classId,
      Date: date
    });
  
    return {id: result};
  }

}

export default new ClassAttendance();