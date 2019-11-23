import {Model} from './base';
import crypto from 'crypto';
import validator from 'validator';
import {createSecurePassword} from '../../services/passwordGenerator';

class Parent extends Model {
  constructor() {
    super('Parents');
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
    
    
    const selectResult = await connection.query(
      `SELECT *
      FROM Users
      WHERE eMail = ?;`,
      [eMail]
    );

    if (selectResult.length != 0) {
      if (selectResult[0].isParent) {
        throw new Error('Parent already in db');
      } else {
          const updateResult = await connection.query(
            `UPDATE Users
            SET IsParent = true
            WHERE ID = ?;`,
            [selectResult[0].ID]
          );
          connection.release();
          if (updateResult.affectedRows != 1) {
            return {
              "Success": false,
              "Operation": 'UPDATE'
            }
          }
          return {
            "Success": true,
            "Operation": 'UPDATE'
          }
              
      }
    }

    //insert of data
    const parentId = crypto.createHash('sha256').update(eMail).digest('hex');
    const parentPassword = createSecurePassword(password);


    const insertResult = await connection.query(
      `INSERT INTO Users (ID, eMail, Password, IsParent, FirstName, LastName, SSN)
      VALUES (?, ?, ?, true);`,
      [parentId, eMail, parentPassword, firstName, lastName, SSN]
    );
    connection.release();
    
    if (updateResult.affectedRows != 1) {
      return {
        "Success": false,
        "Operation": 'INSERT'
      }
    }
    
    return {
      "Success": true,
      "Operation": 'INSERT'
    }
  }

  validateSSN(SSN){
    const SSNRegexp = /^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$/;
    return SSNRegexp.test(SSN);
  }





}

export default new Parent();