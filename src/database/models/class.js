import {Model} from './base';
import moment from 'moment';

class Class extends Model {
  constructor() {
    super('Classes');
  }

  async getClassNameById(classId) {
    try{
      const connection = await this.db.getConnection();
      const sql_query = `select ID, CreationYear, Name from ${this.tableName} 
      where ID = ? ;`;
      const results = await connection.query(sql_query, [classId]);

      connection.release();

      if (!results.length) {
        throw new Error('Entity not found');
      }

      const classObj = results[0];
      const currYear = moment().utc().year();
      
      const classYear =  classObj["CreationYear"]
      const yearName = currYear - classYear + 1;
      
      const className = yearName + classObj["Name"];
      return className;
    }
    catch(e){
      console.log(e);
      throw e;
    }    
  }

  async assignStudentsToClass(classID, students) {
    const studentsIDs = students.map((s) => "'" + s + "'").join(',');
    const query = `
      UPDATE Students
      SET ClassId = ?
      WHERE ID IN (${studentsIDs})
    `;

    const res = {};
    const connection = await this.db.getConnection();
    const results = await connection.query(query, [classID]);
    
    connection.release();

    if (!results.affectedRows) {
      res["Success"] = false;
      res["Message"] = "Something went wrong."; 
    } else {
      res["Success"] = true;
      res["Message"] = "Students associated successfully."; 
    }

    return res;
  }
}

export default new Class();