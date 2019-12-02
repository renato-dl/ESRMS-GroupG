import {Model} from './base';

class Assignment extends Model {
  constructor() {
    super('Assignments');
  }

  async findByStudentId(studentId, dateRange, pagination) {
    if (!studentId) throw new Error('Missing or invalid student id');
    
    const connection = await this.db.getConnection();
    let query;

    if (dateRange.from && dateRange.to) {
        query =`SELECT SU.Name, A.Title, A.Description, A.DueDate  
        FROM Assignments A, Students ST, Subjects SU
        WHERE A.ClassId = ST.ClassId AND A.SubjectId = SU.ID AND ST.ID = ?
        AND A.DueDate >= ? AND A.DueDate <= ?
        ORDER BY A.DueDate`;
    } else {
        query =`SELECT SU.Name, A.Title, A.Description, A.DueDate  
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
}
export default new Assignment();