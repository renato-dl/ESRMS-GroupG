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
}

export default new Class();