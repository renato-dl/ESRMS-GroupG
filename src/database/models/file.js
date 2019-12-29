import {Model} from './base';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

class File extends Model {
  constructor() {
    super('Files');
  }

  async findAllIn(ids) {
    const connection = await this.db.getConnection();
    const results = await connection.query(`SELECT * FROM ${this.tableName} WHERE ID IN(${ids})`);
    connection.release();

    return results;
  }

  async remove(id) {
    // delete file from here;
    const file = await this.findById(id);
    this.removeFileFromStorage(file.Key);
    return super.remove(id);
  }

  async removeMany(ids) {
    ids = ids.map((ID) => "'" + ID + "'").join(',');
    const files = await this.findAllIn(ids);
    const filePromises = files.map((file) => this.removeFileFromStorage(file.Key));
    await Promise.all(filePromises);
    return super.removeMany(ids);
  }

  async removeFileFromStorage(key) {
    const unlinkAsync = promisify(fs.unlink);
    try {
      await unlinkAsync(path.join(__dirname, "../../../", "uploads", key));
    } catch(e) {
      console.log(e);
    }
  }
}

export default new File();