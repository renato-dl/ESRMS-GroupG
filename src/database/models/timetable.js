import {Model} from './base';
import Class from '../models/class';
import {
  groupBy,
  sortBy,
  pick,
  isArray,
  isInteger,
  isString,
  isEqual
} from 'lodash';

const DEFAULT_HOURS = [8, 9, 10, 11, 12, 13];
const DEFAULT_DAYS = [1, 2, 3, 4, 5];

class Timetable extends Model {
  constructor() {
    super('Timetable');
  }

  parseHour(hour) {
    if (isInteger(hour)) {
      return hour;
    }

    if (isString(hour)) {
      if (hour.includes(':')) {
        return Number(hour.slice(0, hour.indexOf(':')));
      }

      if (hour.length > 1) {
        return Number(`${hour.charAt(0)}${hour.charAt(1)}`);
      }

      return Number(hour.charAt(0));
    }

    return 0;
  }

  async list() {
    const query = `
      SELECT T.Day, T.Hour, S.ID as SubjectID, C.ID as ClassID
      FROM Timetable T, Subjects S, Classes C
      WHERE T.ClassId = C.ID
      AND T.SubjectId = S.ID
      ORDER BY C.ID ASC, T.Day ASC, T.Hour ASC
    `;

    const connection = await this.db.getConnection();
    const results = await connection.query(query);
    connection.release();

    const grouppedData = groupBy(results, 'ClassID');
    return Object.keys(grouppedData).map((ClassID) => {
      return {
        ClassID,
        Timetable: grouppedData[ClassID].map((item) => pick(item, ['Day', 'Hour', 'SubjectID']))
      }
    });
  }

  async add(classId, timetable) {
    if (!classId) {
      throw new Error('Missing or invalid classId.');
    }

    if (!timetable) {
      throw new Error('Missing or timetable.');
    }

    if (!isArray(timetable)) {
      throw new Error('Invalid timetable type.')
    }

    if (!timetable.length) {
      throw new Error('Empty timetable.')
    }

    const allowedDays = [...DEFAULT_DAYS];
    let allowedHours = [...DEFAULT_HOURS];

    // check if all days are passed
    const daysReceived = [...new Set(timetable.map((entry) => entry.day))];
    if (!isEqual(sortBy(allowedDays), sortBy(daysReceived))) {
      throw new Error('Incomplete timetable.')
    }

    // check hours
    const groupedByDay = groupBy(timetable, 'day');
    Object.keys(groupedByDay).forEach((day) => {
      const dayHours = groupedByDay[day];
      // check if all time slots are passed
      const hoursReceived = [...new Set(dayHours.map((entry) => this.parseHour(entry.hour)))];

      if (hoursReceived.length > allowedHours.length) {
        throw new Error('Invalid timetable hours.');
      }
      
      // case when the last hour (13) is not proviced
      if (hoursReceived.length < allowedHours.length) {
        allowedHours.pop();
      }

      if (!isEqual(sortBy(allowedHours), sortBy(hoursReceived))) {
        throw new Error('Invalid timetable hours.');
      }

      allowedHours = [...DEFAULT_HOURS];
    });

    const subjectsRecieved = [...new Set(timetable.map((entry) => entry.subjectId).filter((entry) => entry))];
    if (!subjectsRecieved.length) {
      throw new Error('Invalid subjects.');
    }

    const connection = await this.db.getConnection();
    const subjectIds = subjectsRecieved.map((ID) => "'" + ID + "'").join(',');
    const subjects = await connection.query(`SELECT * FROM Subjects WHERE Subjects.ID IN (${subjectIds})`);
    if (subjects.length !== subjectsRecieved.length) {
      connection.release();
      throw new Error('Invalid subjects.');
    }

    let currentClass = null;
    try {
      currentClass = await Class.findById(classId);
    } catch(e) {
      connection.release();
      throw new Error('Class not found.');
    }

    const currentTimetable = await connection.query(`SELECT * FROM ${this.tableName} WHERE ClassId = ? LIMIT 1`, [currentClass.ID]);
    if (currentTimetable.length) {
      throw new Error('Class already has a timetable.');
    }

    const parsedTimetableData = timetable.map((entry) => {
      return {
        ClassId: classId,
        SubjectId: entry.subjectId,
        Day: entry.day,
        Hour: '' + this.parseHour(entry.hour)
      }
    });

    let results = [];
    try {
      results = await this.createMany(parsedTimetableData);
    } catch(e) {
      connection.release();
      throw new Error('Class already has a timetable or the provided timetable contents are invalid.');
    }
    
    connection.release();
    return !!results.length;
  }

  async remove(classId) {
    if (!classId) {
      throw new Error('Missing or invalid classId.');
    }

    const connection = await this.db.getConnection();
    const schedules = await connection.query(`SELECT * FROM ${this.tableName} WHERE ClassId = ?`, [classId]);

    if (schedules.length) {
      await this.removeMany([schedules.map((i) => i.ID)]);
      connection.release();
    }
  }
}

export default new Timetable();