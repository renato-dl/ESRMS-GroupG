import {Model} from './base';

class Subject extends Model {
  constructor() {
    super('Subjects');
  }

  async findByTeacherId(teacherId) {
    const connection = await this.db.getConnection();
    const results = await connection.query(/* @Xileny your query here, see student model for reference */);

    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }

    return results;
  }

}

export default new Subject();