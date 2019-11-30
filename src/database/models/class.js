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

  async getClasses(pagination) {
    let query = `
      SELECT C.ID, C.CreationYear, C.Name, CONCAT_WS(' ', U.FirstName, U.LastName) as Coordinator
      FROM Classes C, Users U
      WHERE C.CoordinatorId = U.ID
    `;

    const connection = await this.db.getConnection();

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query);
    connection.release();

    return results;
  }
}

export default new Class();