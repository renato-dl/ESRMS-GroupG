import {Model} from './base';
import uuid from 'uuid/v4';
import validator from 'validator';
import {createSecurePassword} from '../../services/passwordGenerator';
import {validateSSN} from '../../services/ssnValidator'

class User extends Model {
  constructor() {
    super('Users');
  }
  async getUserRolesById(userId) {
    const connection = await this.db.getConnection();
    return connection.query(
      `SELECT IsParent, IsTeacher, IsPrincipal, IsAdminOfficer, IsSysAdmin
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

  async getParentData(pagination){
    const connection = await this.db.getConnection();
    let query = `SELECT FirstName, LastName, SSN , eMail, CreatedOn
    FROM Users
    WHERE IsParent = true
    ORDER BY LastName`;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query);    
    connection.release();

    if (!results.length) {
      throw new Error('No parents registered in the system');
    }
    return results;
  }

  async insertParentData(firstName, lastName, eMail, SSN, password) {

    await this.validateParentData(firstName, lastName, eMail, SSN);

    //insert of data
    const parentId = uuid();
    const parentPassword = createSecurePassword(password);

    await this.create({
      ID: parentId,
      eMail: eMail,
      Password: parentPassword,
      IsParent: true,
      FirstName: firstName,
      LastName: lastName,
      SSN: SSN
    });

    return {
      id: parentId
    }
  }

  async validateParentData(firstName, lastName, eMail, SSN) {
    //input data validation
    if (!validator.matches(firstName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
      throw new Error('Missing or invalid first name');
    }
    if (!validator.matches(lastName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
      throw new Error('Missing or invalid last name');
    }
    if (!validator.isEmail(eMail)) {
      throw new Error('Missing or invalid email');
    }
    if (!SSN || !validateSSN(SSN)) {
      throw new Error('Missing or invalid SSN');
    }

    const connection = await this.db.getConnection();

    const selectResult = await connection.query(
      `SELECT COUNT(*) AS count
      FROM Users
      WHERE SSN = ? OR eMail = ?;`,
      [SSN, eMail]
    );

    connection.release();

    if (selectResult[0].count != 0) {
      connection.release();
      throw new Error('Parent already in db')
    }
  }

}

export default new User();

