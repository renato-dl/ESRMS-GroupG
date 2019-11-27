import {Model} from './base';

class Assignment extends Model {
  constructor() {
    super('Assignments');
  }

  async findByStudentId(studentId, dateRange, pagination) {
    if (!studentId) throw new Error('Missing or invalid student id');

    const connection = await this.db.getConnection();
    let query;
    if(dateRange){
        query =`SELECT SU.Name, A.Title, A.Description, A.DueData  
        FROM Assignments A, Students ST, Subjects SU
        WHERE A.ClassId = ST.ClassId AND A.SubjectId = SU.ID AND ST.StudentId = ?
        AND A.DueDate >= ? AND A.DueDate <= ?
        ORDER BY A.DueDate`,
        [studentId, dateRange.from, dateRange.to]
    }
    else{
        query =`SELECT SU.Name, A.Title, A.Description, A.DueData  
            FROM Assignments A, Students ST, Subjects SU
            WHERE A.ClassId = ST.ClassId AND A.SubjectId = SU.ID AND ST.StudentId = ?
            ORDER BY A.DueDate`,
            [studentId]
    }
    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query, [studentId]);

    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }
    return results;
  }
}
export default new Assignment();