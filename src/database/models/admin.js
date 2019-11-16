import {Model} from './base';
const crypto =  require('crypto');
const passwordValidator = require('password-validator');
const eMailValidator = require('email-validator');
const stringValidator = require('validator');

class Admin extends Model {
  constructor() {
    super('Admin');
  }
  async insertParentData(adminId, firstName, lastName, eMail, SSN, password) {

      //input data validation
      if (!adminId){
        throw new Error('Missing or invalid admin Id');
      }
      if (!stringValidator.isAlpha(firstName)) {
        throw new Error('Missing or invalid first name');
      }
      if (!stringValidator.isAlpha(lastName)) {
        throw new Error('Missing or invalid last name');
      }
      if (!eMailValidator.validate(eMail)) {
        throw new Error('Missing or invalid email');
      }
      if (!SSN || !this.validateSSN(SSN)) {
        throw new Error('Missing or invalid SSN');
      }
      if (!this.validatePassword(SSN)) {
        throw new Error('Missing or invalid password');
      }

    const connection = await this.db.getConnection();

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

    //insert of data
    const parentId = crypto.createHash('sha256').update(eMail).digest('hex');
    const parentPassword = this.createSecurePassword(password);
    let insertParentResult;
    //begin transaction
    connection.beginTransaction()
        .then(() =>{
          connection.query(
            `INSERT INTO Users (ID, eMail, Password, Role)
            VALUES (?, ?, ?, 'parent');`,
            [parentId, eMail, parentPassword]
          );
          
          insertParentResult = connection.query(
            `INSERT INTO Parents (ID, FirstName, LastName, SSN)
            VALUES (?, ?, ?, ?);`,
            [parentId, firstName, lastName, SSN]
          );
        
        })
        .then(() => {
          connection.commit();
          connection.release();
          return {id: insertParentResult.parentId};
        })
        .catch((err) => {
          connection.rollback();
          throw newError('Operation failed');
        })
  }

  validateSSN(SSN){
    const SSNRegexp = /^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$/;
    return SSNRegexp.test(SSN);
  }

  validatePassword(password){
    let schema = new passwordValidator();
    schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    return schema.validate(password);
  }
  
  createSecurePassword(password){

    //first we create the salt
    const genRandomString = function(length){
      return crypto.randomBytes(Math.ceil(length/2))
              .toString('hex') /** convert to hexadecimal format */
              .slice(0,length);   /** return required number of characters */
  };

   //then salt hash password
    let hash = crypto.createHmac('sha256', genRandomString(16));
    hash.update(password);
    return hash.digest('hex');
  
  }

}
export default new Admin();