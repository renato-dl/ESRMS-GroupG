import {Model} from './base';

class Note extends Model {
  constructor() {
    super('Notes');
  }

  async findByClassId(classId, dateRange, pagination) {
    if (!classId) throw new Error('Missing or invalid class id');
    
    const connection = await this.db.getConnection();
    let query;

    if (dateRange.from && dateRange.to) {
        query =`
        SELECT DISTINCT N.ID, N.Title, N.Description, N.Date, N.IsSeen, S.FirstName, S.LastName
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
  
}
export default new Note();