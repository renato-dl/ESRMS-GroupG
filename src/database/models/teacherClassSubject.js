import {Model} from './base';

class TCSR extends Model {
  constructor() {
    super('TeacherSubjectClassRelation');
  }

  async checkIfTeacherTeachesSubjectInClass(teacherId, subjectId, classId) {

    if (!teacherId) throw new Error('Missing or invalid teacher id');
    if (!subjectId) throw new Error('Missing or invalid subject id');
    if (!classId) throw new Error('Missing or invalid class id');

    const connenction = await this.db.getConnection();
    const result = await connenction.query(
      `SELECT COUNT(*) AS count
      FROM ${this.tableName}
      WHERE TeacherId = ? AND SubjectId = ? AND ClassId = ?;`
      [teacherId, subjectId, classId]
    );
    connenction.release();
    if (result[0].count == 1) {
      return true;
    }
    return false;

  }

}

export default new TCSR();




