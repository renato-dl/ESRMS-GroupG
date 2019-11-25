import {Model} from './base';
import crypto from 'crypto';
import validator from 'validator';
import {createSecurePassword} from '../../services/passwordGenerator';
import {validateSSN} from '../../services/ssnValidator'

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

  async insertParentData(firstName, lastName, eMail, SSN, password) {

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

    try {
      const selectResult = await connection.query(
        `SELECT *
        FROM Users
        WHERE SSN = ? OR eMail = ?;`,
        [SSN, eMail]
      );

      if (selectResult.length != 0) {
        connection.release();
        throw new Error('User already in db')
      }

      //insert of data
      const parentId = crypto.createHash('sha256').update(eMail).digest('hex');
      const parentPassword = createSecurePassword(password);

      const insertResult = await connection.query(
        `INSERT INTO Users (ID, eMail, Password, IsParent, FirstName, LastName, SSN)
        VALUES (?, ?, ?, true, ?, ?, ?);`,
        [parentId, eMail, parentPassword, firstName, lastName, SSN]
      );
      connection.release();

      if (insertResult.affectedRows != 1) {
        throw new Error('Something went wrong')
      } else {
        return {
          id: parentId
        }
      }
      
    } catch(err) {
      connection.release();
      console.log(err.message);
      throw(err);
    }
  }

}

export default new Parent();