import {Model} from './base';
import {groupBy, pick} from 'lodash';

class Timetable extends Model {
  constructor() {
    super('Timetable');
  }

  async list() {
    const query = `
      SELECT T.Day, T.Hour, S.ID as SubjectID, C.Name as ClassName, C.ID as ClassID, C.CreationYear, CONCAT_WS(' ', U.FirstName, U.LastName) as Coordinator
      FROM Timetable T, Subjects S, Classes C, Users U
      WHERE T.ClassId = C.ID
      AND T.SubjectId = S.ID
      AND C.CoordinatorId = U.ID
      ORDER BY C.ID ASC, T.Hour ASC, T.Day ASC
    `;

    const connection = await this.db.getConnection();
    const results = await connection.query(query);
    connection.release();

    if (results.length) {
      const grouppedData = groupBy(results, 'ClassID');
      return Object.keys(grouppedData).map((ClassID) => {
        return {
          ClassID,
          ClassName: ClassID + '' + grouppedData[ClassID][0].ClassName,
          CreationYear: grouppedData[ClassID][0].CreationYear,
          Coordinator: grouppedData[ClassID][0].Coordinator,
          Timetable: grouppedData[ClassID].map((item) => pick(item, ['Day', 'Hour', 'SubjectID']))
        }
      });
    }

    return [];
  }

  async add(data) {
    return {};
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