import {Model} from './base';
import User from './user';
import moment from 'moment';
import {getHour} from '../../services/schoolHours';

class StudentAttendance extends Model {
  constructor() {
    super('StudentAttendance');
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
        const teacher = await User.findById(element.EntryTeacherId);
        newElement.EntryTeacherName = teacher.FirstName + ' ' + teacher.LastName;
      }
      if(element.ExitTeacherId) {
        const teacher = await User.findById(element.ExitTeacherId);
        newElement.ExitTeacherName = teacher.FirstName + ' ' + teacher.LastName;
      }
      return newElement;
    }));

    return results;
  }

  /*
  async registerSingleAbsence(studentId, teacherId) {
    if (!studentId) {
      throw new Error('Missing or invalid studentId');
    }
    if (!teacherId) {
      throw new Error('Missing or invalid teacherId');
    }
    const isAlreadyRecorded = await this.isStudentAlreadyRecorded(studentId);
    if (isAlreadyRecorded) {
      throw new Error('There is already an attendance record for the selected student');
    }

    // TODO: verify that teacherId is authorized to be EntryTeacher

    const date = moment().utc();

    const result = await this.create({
      StudentId: studentId,
      Date: date.format(this.db.getDateFormatString()),
      EntryTeacherId: teacherId
    });

    return {id: result};
    
  }
  */

  async isStudentAlreadyRecorded(studentId) {
    if (!studentId) {
      throw new Error('Missing or invalid studentId');
    }
    const query = `
      SELECT COUNT(*) AS count
      FROM ${this.tableName}
      WHERE StudentId = ? AND Date = ?
    `;
    
    const date = moment().utc();
    const connection = await this.db.getConnection();
    let result;
    try {
      result = await connection.query(query, [
        studentId,
        date.format(this.db.getDateFormatString())
      ]);
    } catch(error) {
      console.log(error);
    } finally {
      connection.release();
    }

    if (result[0].count != 0) {
      return true;
    }
    return false;
  }

  async registerBulkAbsence(students, teacherId) {
    if (!students || !Array.isArray(students)) {
      throw new Error('Missing or invalid student array');
    }
    if (!teacherId) {
      throw new Error('Missing or invalid teacherId');
    }

    // TODO: verify that teacherId is authorized to be EntryTeacher

    await Promise.all(students.map(async element => {
      if (await this.isStudentAlreadyRecorded(element)) {
        throw new Error('There is already a record for one or more students');
      }
    }));
    const query = `
      INSERT INTO ${this.tableName}(StudentId, Date, EntryTeacherId)
      VALUES (?, ?, ?)
    `;
    const date = moment().utc().format(this.db.getDateFormatString());
    const values = students.map(element => {
      return [element, date, teacherId];
    });
    
    const connection = await this.db.getConnection();
    let result;
    try {
      result = await connection.batch(query, values);
    } catch (error) {
      console.log(error);
    } finally {
      connection.release();
    }
    return {newRecords: result.affectedRows}

  }

  async getDailyAttendanceByClassId(classId, date) {
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
      SELECT
        S.ID AS SId,
        S.FirstName,
        S.LastName,
        A.*
      FROM Students S LEFT JOIN ${this.tableName} A
      ON S.ID = A.StudentId
      AND A.Date = ?
      WHERE S.ClassId = ?
      ORDER BY S.LastName, S.FirstName
    `;

    const connection = await this.db.getConnection();
    let result;
    try {
      result = await connection.query(query, [dateStr, classId]);
    } catch (error) {
      console.log(error);
    } finally {
      connection.release();
    }
    const newRes = result.map(element => {
      let newElement = {};
      newElement.StudentId = element.SId;
      newElement.FirstName = element.FirstName;
      newElement.LastName = element.LastName;
      newElement.Present = false;
      if(!element.ID) {
        newElement.Present = true;
      } else {
        if (element.LateEntry) {
          newElement.Present = true;
          newElement.LateEntry = element.LateEntry;
        }
        if (element.EarlyExit) {
          newElement.Present = true;
          newElement.EarlyExit = element.EarlyExit;
        }
      }
      return newElement;
      
    });
    return newRes;
  }

  async registerLateEntry(studentId, teacherId) {
    if (!studentId) {
      throw new Error('Missing or invalid studentId');
    }
    if (!teacherId) {
      throw new Error('Missing or invalid teacherId');
    }
    let hour;
    switch(getHour()) {
      case 0:
        throw new Error('Attendance record editing is not permitted at this time')
      case 1:
        hour = '1h';
        break;
      case 2:
        hour = '2h';
        break;
    }
    const todayStr = moment().utc().format('YYYY-MM-DD');
    const existingRecord = await this.findByStudentId(studentId, {
      from: todayStr,
      to: todayStr
    });
    if (existingRecord.length == 0) {
      throw new Error('Student is not registered as absent');
    }
    if (existingRecord[0].LateEntry != null || existingRecord[0].EarlyExit != null) {
      throw new Error('Student is not registered as absent');
    }
    
    const todayStr2 = moment().utc().format(this.db.getDateFormatString());
    const query = `
      UPDATE ${this.tableName}
      SET LateEntry = '${hour}', EntryTeacherId = ?
      WHERE StudentId = ? AND Date = '${todayStr2}' 
    `;
    const connection = await this.db.getConnection();
    let result;
    try {
      result = await connection.query(query, [teacherId, studentId]);
    } catch (error) {
      console.log(error);
    } finally {
      connection.release();
    }
    return {affectedRows: result.affectedRows}
  }

  async registerEarlyExit(studentId, teacherId) {
    if (!studentId) {
      throw new Error('Missing or invalid studentId');
    }
    if (!teacherId) {
      throw new Error('Missing or invalid teacherId');
    }
    const today = moment().utc();
    const date = today.format('YYYY-MM-DD');
    const time = today.format('HH:mm');
    const existingRecord = await this.findByStudentId(studentId, {
      from: date,
      to: date
    });
    if (existingRecord.length == 0) { // present
      const result = await this.create({
        StudentId: studentId,
        Date: today.format(this.db.getDateFormatString()),
        EarlyExit: time,
        ExitTeacherId: teacherId
      });
      return {id: result};
    }
    if (existingRecord[0].LateEntry == null && existingRecord[0].EarlyExit == null) { // absent
      throw new Error('Student is registered as absent');
    }
    if (existingRecord[0].EarlyExit != null) { // already out
      throw new Error('There is already an early exit record');
    }
    // present with late entry
    const query = `
      UPDATE ${this.tableName}
      SET EarlyExit = '${time}', ExitTeacherId = ?
      WHERE StudentId = ? AND Date = '${date}' 
    `;
    const connection = await this.db.getConnection();
    let result;
    try {
      result = await connection.query(query, [teacherId, studentId]);
    } catch (error) {
      console.log(error);
    } finally {
      connection.release();
    }
    return {affectedRows: result.affectedRows}
  }

}

export default new StudentAttendance();