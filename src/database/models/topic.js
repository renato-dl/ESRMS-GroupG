import {Model} from './base';

class Topic extends Model {
  constructor() {
    super('Topics');
  }

  async insertNewTopic(/* PARAMS*/) {
    const connection = await this.db.getConnection();
    const results = await connection.query(/* @Renato */);

    connection.release();

    // @Renato
    if (!results.length) {
      throw new Error();
    }

    return results;
  }

  async deleteTopic(topicId) {
    const connection = await this.db.getConnection();
    const results = await connection.query(/* @Renato */);

    connection.release();

    // @Renato
    if (!results.length) {
      throw new Error();
    }

    return results;
  }

  async editTopic(/* PARAMS*/) {
    // @Xileny
  }

  async findByTeacherClassSubject(/* PARAMS*/) {
    // @Xhoi, good luck
  }

}

export default new Topic();