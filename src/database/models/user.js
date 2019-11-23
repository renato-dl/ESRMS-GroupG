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
}

export default new User();

