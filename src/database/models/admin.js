import {Model} from './base';
const crypto =  require('crypto');

class Admin extends Model {
  constructor() {
    super('Admin');
  }
  async insertParentData(adminId, firstName, lastName, eMail, SSN, password) {

      //data validation
      if (!adminId){
        throw new Error('Missing or invalid admin Id');
      }
      if (!firstName) {
        throw new Error('Missing or invalid first name');
      }
      if (!lastName) {
        throw new Error('Missing or invalid last name');
      }
      if (!eMail || !this.validateEmail(eMail)) {
        throw new Error('Missing or invalid email');
      }
      if (!SSN || !this.validateSSN(SSN)) {
        throw new Error('Missing or invalid SSN');
      }
      if (!password || !this.validatePassword(SSN)) {
        throw new Error('Missing or invalid password');
      }

    const connection = await this.db.getConnection();

    //admin authorization
    const selectResult = await connection.query(
      `SELECT *
      FROM Users
      WHERE ID = ?`,
      [adminId]
    );

    if(selectResult.length != 1) {
      throw new Error('Unauthorized');
    };

    //insert of data
    const parentId = crypto.createHash('sha256').update(eMail).digest('hex');
    const parentPassword = crypto.createHash('sha256').update(password).digest('hex');

    const insertResult = await connection.query(
      `INSERT INTO Parent (ID, FirstName, LastName, eMail, SSN, password)
      VALUES (?, ?, ?, ?, ?, ?);`,
      [parentId, firstName, lastName, eMail, SSN, parentPassword]
    );

    connection.release();

    if (insertResult.affectedRows != 1) {
      throw new Error('Operation failed');
    }

    return {id: insertResult.parentId};

  }

  validateEmail(eMail){
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(eMail);
  }
  validateSSN(SSN){
    const SSNRegexp = /^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$/;
    return SSNRegexp.test(SSN);
  }

  validatePassword(Password){
    const passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return passRegex.test(Password);
  }

}
export default new Admin();