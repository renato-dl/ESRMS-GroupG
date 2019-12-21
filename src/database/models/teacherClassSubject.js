import {Model} from './base';
import Class from './class';

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
      WHERE TeacherId = ? AND SubjectId = ? AND ClassId = ?`,
      [teacherId, subjectId, classId]
    );
    connenction.release();
    if (result[0].count == 1) {
      return true;
    }
    return false;

  }

  async checkIfTeacherTeachesInClass(teacherId, classId) {

    if (!teacherId) throw new Error('Missing or invalid teacher id');
    if (!classId) throw new Error('Missing or invalid class id');

    const connenction = await this.db.getConnection();
    const result = await connenction.query(
      `SELECT COUNT(*) AS count
      FROM ${this.tableName}
      WHERE TeacherId = ? AND ClassId = ?`,
      [teacherId, classId]
    );
    connenction.release();
    if (result[0].count == 1) {
      return true;
    }
    return false;

  }



  async getTeachingClasses(teacherId) {
    if(!teacherId){
      throw new Error('Missing or invalid teacher id');
    }
    let query = `
      SELECT DISTINCT ClassId
      FROM ${this.tableName}
      WHERE TeacherId = ?`;

    const connection = await this.db.getConnection();
    const results = await connection.query(query, [teacherId]);
    connection.release();

    await Promise.all(results.map(async element =>{
      let newElement = element;
      const name = await Class.getClassNameById(element.ClassId);
      newElement.ClassName = name;
      return newElement;
    }));

    return results;
    
  }

}

export default new TCSR();




