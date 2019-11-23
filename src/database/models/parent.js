import {Model} from './base';
import crypto from 'crypto';
import validator from 'validator';
import {createSecurePassword} from '../../services/passwordGenerator';
import {validatePassword} from '../../services/passwordValidator';

class Parent extends Model {
  constructor() {
    super('Parents');
  }

  async getParentData(pagination){
    const connection = await this.db.getConnection();
    let query = `SELECT FirstName, LastName, SSN , eMail, Parents.CreatedOn
    FROM Parents, Users
    WHERE Parents.ID = Users.ID
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

  async insertParentData(adminId, firstName, lastName, eMail, SSN, password) {

      //input data validation
      if (!adminId){
        throw new Error('Missing or invalid admin Id');
      }
      if (!validator.matches(firstName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
        throw new Error('Missing or invalid first name');
      }
      if (!validator.matches(lastName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
        throw new Error('Missing or invalid last name');
      }
      if (!validator.isEmail(eMail)) {
        throw new Error('Missing or invalid email');
      }
      if (!SSN || !this.validateSSN(SSN)) {
        throw new Error('Missing or invalid SSN');
      }
      
    const connection = await this.db.getConnection();

    /*
    NOT NEEDED ANYMORE WITH AUTHENTICATION
    //admin authorization
    const selectResult = await connection.query(
      `SELECT ID
      FROM Users
      WHERE ID = ? AND Role='admin'`,
      [adminId]
    );

    if(selectResult.length != 1) {
      throw new Error('Unauthorized');
    };
    */

    //insert of data
    const parentId = crypto.createHash('sha256').update(eMail).digest('hex');
    const parentPassword = createSecurePassword(password);
    
    //begin transaction
    try {
      await connection.query(
        `INSERT INTO Users (ID, eMail, Password, IsParent)
        VALUES (?, ?, ?, true);`,
        [parentId, eMail, parentPassword]
      );

      await connection.query(
        `INSERT INTO Parents (ID, FirstName, LastName, SSN)
        VALUES (?, ?, ?, ?);`,
        [parentId, firstName, lastName, SSN]
      );

      connection.commit();
      connection.release();
      
    } catch(err) {
      connection.rollback();
      connection.release();
      console.log(err);
      throw new Error('Operation failed');
    }    
    
    return {id: parentId};
  }

  validateSSN(SSN){
    const SSNRegexp = /^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$/;
    return SSNRegexp.test(SSN);
  }





}

export default new Parent();