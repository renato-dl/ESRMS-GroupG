import {Model} from './base';

class User extends Model {
  constructor() {
    super('users');
  }
  async getUserRolesById(userId) {
    const connection = await this.db.getConnection();
    return connection.query(
      `SELECT IsParent, IsTeacher, IsPrincipal , IsAdminOfficer, IsSysAdmin
      FROM Users
      WHERE ID = ?;`,
      [userId]
    )
  }
  
  async isValidParent(userId) {
    const connection = await this.db.getConnection();

    const selectResult = await connection.query(
      `SELECT *
      FROM Users
      WHERE ID = ? AND IsParent = true;`,
      [userId]
    );
    connection.release();
    if (selectResult.length != 1) {
      return false;
    }
    return true;
  }

}

export default new User();

