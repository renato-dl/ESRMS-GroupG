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

  async makeParentIfNotAlready(userId) {

    let user;
    try {
      user = await this.findById(userId);
    } catch(err) {
      throw new Error('Invalid userId');
    }
    if (user.IsParent != 1) {
      this.update(userId, {IsParent: true});
    }
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

    await this.validateUserData(firstName, lastName, eMail, SSN);

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

  async insertInternalAccountData(firstName, lastName, eMail, SSN, password, isSysAdmin, isTeacher, isAdminOfficer, isPrincipal) {

    await this.validateUserData(firstName, lastName, eMail, SSN);
    
    await this.vaidateUserRoles(isSysAdmin, isTeacher, isAdminOfficer, isPrincipal);

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
      throw new Error('User already in db')
    }

    //insert of data
    const userId = uuid();
    const parentPassword = createSecurePassword(password);

    await this.create({
      ID: userId,
      eMail: eMail,
      Password: parentPassword,
      IsSysAdmin: isSysAdmin,
      IsTeacher: isTeacher,
      IsAdminOfficer: isAdminOfficer,
      IsPrincipal: isPrincipal,
      FirstName: firstName,
      LastName: lastName,
      SSN: SSN
    });

    return {
      id: userId
    }
  }  

  async vaidateUserRoles(isSysAdmin, isTeacher, isAdminOfficer, isPrincipal) {
    if (isTeacher && isAdminOfficer) {
      throw new Error('A user cannot be both teacher and admin officer');
    }
    if (isSysAdmin && !isAdminOfficer) {
      throw new Error('The sysadmin must be also admin officer');
    }
    if (isAdminOfficer && isPrincipal) {
      throw new Error('A user cannot be both admin and principal');
    }

    if (!isAdminOfficer && !isTeacher && !isPrincipal) {
      throw new Error('A user must be at least admin officer, principal or teacher');
    }
    return;
  }

  async updateParentData(parentId, firstName, lastName, eMail, SSN) {

    await this.validateUserData(firstName, lastName, eMail, SSN);

    //update of data
    
    const result = await this.update(parentId, {
      eMail: eMail,
      IsParent: true,
      FirstName: firstName,
      LastName: lastName,
      SSN: SSN
    });

    return {
      success: result
    }
  }

  async validateUserData(firstName, lastName, eMail, SSN) {
    //input data validation
    if (!firstName || !validator.matches(firstName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
      throw new Error('Missing or invalid first name');
    }
    if (!lastName || !validator.matches(lastName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
      throw new Error('Missing or invalid last name');
    }
    if (!eMail || !validator.isEmail(eMail)) {
      throw new Error('Missing or invalid email');
    }
    if (!SSN || !validateSSN(SSN)) {
      throw new Error('Missing or invalid SSN');
    }
  }

  async searchUsersBySSN(ssn) {
    const connection = await this.db.getConnection();
    
    let query = `
      SELECT *
      FROM Users
      WHERE SSN LIKE '%${ssn}%'
      ORDER BY LastName
    `;

    const results = await connection.query(query);    
    connection.release();

    return results;
  }
  async getParentById(parentId){
    const connection = await this.db.getConnection();
    
    let query = `
      SELECT ID, eMail, FirstName, LastName, SSN
      FROM Users
      WHERE IsParent = true
      AND ID = ?`;

    const results = await connection.query(query, [parentId]);    
    connection.release();
    return results;
  }

  async findInternalAccounts(pagination) {
    const connection = await this.db.getConnection();

    let query = `
      SELECT
        ID,
        FirstName,
        LastName,
        SSN,
        eMail,
        CreatedOn,
        IsAdminOfficer,
        IsSysAdmin,
        IsParent,
        IsTeacher,
        IsPrincipal
      FROM Users
      WHERE IsTeacher = true
      OR IsAdminOfficer = true
      OR IsPrincipal = true
      ORDER BY LastName
    `;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query);    
    connection.release();

    return results;
  }

}

export default new User();

