import {Model} from './base';

class Subject extends Model {
  constructor() {
    super('Subjects');
  }

  async findByTeacherId(teacherId) {
    try{
      const connection = await this.db.getConnection();
      const sql_query = `select s.*, tscr.classid 
      from teachersubjectclassrelation tscr, ${this.tableName} s
      where tscr.teacherid = ? and tscr.subjectid = s.id ;`;
      const results = await connection.query(sql_query, [teacherId]);

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

export default new Subject();