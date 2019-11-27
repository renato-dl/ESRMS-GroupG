
class TCSR extends Model {
  constructor() {
    super('TeacherSubjectClassRelation');
  }

  async checkIfTeacherTeachesSubjectInClass(teacherId, subjectId, classId) {
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




