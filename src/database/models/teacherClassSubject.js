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

  async createNew(teacherId, CSPairs) {
    if (!CSPairs || !Array.isArray(CSPairs)) {
      throw new Error('Missing or invalid class/subject array');
    }

    await Promise.all(CSPairs.map(async element => {
      const alreadyExists = await this.checkIfTeacherTeachesSubjectInClass(teacherId, element.subjectId, element.classId);
      if (alreadyExists) {
        throw new Error('Teacher already teaches specified subject in specified class');
      }
    }));

    const query = `
      INSERT INTO ${this.tableName}(TeacherId, SubjectId, ClassId)
      VALUES (?, ?, ?)
    `;
    const values = CSPairs.map(element => {
      return [teacherId, element.subjectId, element.classId];
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

  async findAll(pagination) {
    let query = `
      SELECT TCSR.ID, T.LastName, T.FirstName, TCSR.ClassId, S.Name AS Subject
      FROM ${this.tableName} TCSR, Users T, Subjects S
      WHERE TCSR.TeacherId = T.ID AND TCSR.SubjectId = S.ID
      ORDER BY T.LastName, T.FirstName, TCSR.ClassId, TCSR.ID
    `
    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const connection = await this.db.getConnection();
    let results;
    try {
      results = await connection.query(query);
    } catch (error) {
      console.log(error);
    } finally {
      connection.release();
    }
    const newResults = await Promise.all(results.map(async element => {
      let newElement = {};
      newElement.ID = element.ID;
      newElement.LastName = element.LastName;
      newElement.FirstName = element.FirstName;
      newElement.Subject = element.Subject;
      const cName = await Class.getClassNameById(element.ClassId);
      newElement.ClassName = cName;
      return newElement;
    }));
    return newResults;
  }

}

export default new TCSR();




