import {Model} from './base';
import uuid from 'uuid/v4';
import validator from 'validator';
import {createSecurePassword} from '../../services/passwordGenerator';
import {validateSSN} from '../../services/ssnValidator'

class User extends Model {
  constructor() {
    super('Users');
  }

  findOne(params) {
    const columns = "ID, eMail, FirstName, LastName, SSN, IsParent, IsTeacher, IsPrincipal, IsAdminOfficer, IsSysAdmin"
    return super.findOne(params, columns);
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


  async getStudentsData(isAssigned, pagination){
    let result;
    if(isAssigned == 'true'){
      result = true;
    }
    else if(isAssigned == 'false'){
      result = false;
    }
    else{
      throw new Error('Invalid parameter isAssigned!');
    }

    const connection = await this.db.getConnection();
    let query;
    if(result){
      query = `SELECT ID, FirstName, LastName, Gender
      FROM Students
      WHERE ClassId IS NOT NULL
      ORDER BY LastName`
    }
    else{
      query = `SELECT ID, FirstName, LastName, Gender
      FROM Students
      WHERE ClassId IS NULL
      ORDER BY LastName`;
    }
    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query);    
    connection.release();

    if (!results.length) {
      throw new Error('No students registered in the system');
    }
    return results;
  }

  async insertParentData(firstName, lastName, eMail, SSN, password) {

    await this.validateParentData(firstName, lastName, eMail, SSN);

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

  async updateParentData(parentId, firstName, lastName, eMail, SSN) {

    await this.validateParentData(firstName, lastName, eMail, SSN);

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
  }

  async searchParentsBySSN(ssn) {
    const connection = await this.db.getConnection();
    
    let query = `
      SELECT *
      FROM Users
      WHERE IsParent = true
      AND SSN LIKE '%${ssn}%'
      ORDER BY LastName
    `;

    const results = await connection.query(query);    
    connection.release();

    return results;
  }

}

export default new User();

