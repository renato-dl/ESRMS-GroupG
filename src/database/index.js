import {createPool} from 'mariadb';
import {config} from '../config';

class Database {
  constructor() {
    this.instance = createPool({
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.username,
      password: config.db.password,
      timezone: 'utc',
      charset: 'UTF8MB4',
      collation: 'UTF8MB4_UNICODE_CI'
    });
  }

  async getConnection() {
    return await this.instance.getConnection();
  }

  getPreparePattern(attributesLength) {
    if (attributesLength === 1) {
      return '?';
    }

    return '?,'.repeat(attributesLength - 1) + '?';
  }
  
  getPaginationQuery({ page, pageSize }) {
    if (!page || !pageSize) {
      return '';
    }

    return `LIMIT ${pageSize} OFFSET ${page * pageSize}`;
  }

  getDateFormatString() {
    return 'YYYY-MM-DD 00:00:00';
  }
}

export default new Database();
