import {Model} from './base';

class Class extends Model {
  constructor() {
    super('Class');
  }

  async getClassName(classId) {
    try{
      const connection = await this.db.getConnection();
      const sql_query = `select ID, CreationYear, Name from ${this.tableName} 
      where ID = ? ;`;
      const results = await connection.query(sql_query, [classId]);

      connection.release();

      if (!results.length) {
        throw new Error('Entity not found');
      }

      return results;
    }
    catch(e){
      console.log(e);
      throw e;
    }    
  }
}

export default new Class();