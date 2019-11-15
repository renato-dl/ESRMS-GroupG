import {Model} from './base';

class Student extends Model {
  constructor() {
    super('Students');
    this.columns = 'ID, FirstName, LastName, SSN, BirthDate';
  }
  
  async findByParentId(parentId) {
    const connection = await this.db.getConnection();
    const results = await connection.query(
        `SELECT ${this.columns}
        FROM ${this.tableName}
        WHERE Parent1 = ? OR Parent2 = ?`,
        [parentId, parentId]
    );
    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }

    return results;
  }
}

export default new Student();