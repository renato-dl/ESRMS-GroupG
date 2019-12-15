import {Model} from './base';
import uuid from 'uuid/v4';
import validator from 'validator';
import {createSecurePassword} from '../../services/passwordGenerator';
import {validateSSN} from '../../services/ssnValidator'
import student from './student';

class User extends Model {
  constructor() {
    super('Users');
  }

  async isThereAlreadyAPrincipal() {
    const connection = await this.db.getConnection();
    const result = await connection.query(
      `SELECT *
      FROM ${this.tableName}
      WHERE IsPrincipal = true`
    );
    connection.release();
    if (result.length != 0) {
      return true;
    }
    return false;

  }

  async getUserRolesById(userId) {
    const connection = await this.db.getConnection();
    const result = connection.query(
      `SELECT IsParent, IsTeacher, IsPrincipal, IsAdminOfficer, IsSysAdmin
      FROM Users
      WHERE ID = ?;`,
      [userId]
    );
    connection.release();
    return result;
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

  async isValidTeacher(userId) {
    const connection = await this.db.getConnection();

    const selectResult = await connection.query(
      `SELECT *
      FROM Users
      WHERE ID = ? AND IsTeacher = true;`,
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
      await this.update(userId, {IsParent: true});
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

  async insertInternalAccountData(firstName, lastName, eMail, SSN, password, isTeacher, isAdminOfficer, isPrincipal) {

    await this.validateUserData(firstName, lastName, eMail, SSN);
    
    await this.vaidateUserRoles(isTeacher, isAdminOfficer, isPrincipal);

    // TODO: test
    if (isPrincipal) {
      const otherPrincipal = await this.isThereAlreadyAPrincipal();
      if (otherPrincipal) {
        throw new Error('There is already a principal')
      }
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
      throw new Error('User already in db')
    }

    //insert of data
    const userId = uuid();
    const parentPassword = createSecurePassword(password);

    await this.create({
      ID: userId,
      eMail: eMail,
      Password: parentPassword,
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

  async vaidateUserRoles(isTeacher, isAdminOfficer, isPrincipal) {
    if (isTeacher && isAdminOfficer) {
      throw new Error('A user cannot be both teacher and admin officer');
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

    const connection = await this.db.getConnection();

    const selectResult = await connection.query(
      `SELECT COUNT(*) AS count
      FROM Users
      WHERE (SSN = ? OR eMail = ?) AND ID != ?;`,
      [SSN, eMail, parentId]
    );

    connection.release();

    if (selectResult[0].count != 0) {
      throw new Error('SSN or eMail already used by other account');
    }

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


  async deleteAccount(accountId){

    const connection = await this.db.getConnection();

    //check if the account exists and can be deleted

    const checkAccount = await connection.query(
      `SELECT IsParent as isP, IsSysAdmin as isSA, IsTeacher as isT
      FROM Users 
      WHERE ID = ?`,
      [accountId]
    );

    if(!checkAccount.length){
      connection.release();
      throw new Error ('Account does not exist');      
    }

    if(checkAccount[0].isSA){
      connection.release();
      throw new Error ('Cannot delete SysAdmin');      
    }

    if(checkAccount[0].isP){
      const hasChildren = await this.hasChildren(accountId);
      if (hasChildren) {
        connection.release();
        throw new Error ('Cannot delete user with associated students');
      }      
    }

    if(checkAccount[0].isT){
      const hasClass = await this.hasClass(accountId);
      if (hasClass) {
        connection.release();
        throw new Error ('Cannot delete teachers associated to classes');
      }
      const isCoordinator = await this.isCoordinator(accountId);
      if (isCoordinator) {
        connection.release();
        throw new Error ('Cannot delete class coordinators');
      }
    }

    connection.release();
    await this.remove(accountId);
  }

  async editInternalAccount(userId, firstName, lastName, eMail, SSN, isTeacher, isAdminOfficer, isPrincipal) {

    if (!userId) throw new Error('Missing user id');

    await this.validateUserData(firstName, lastName, eMail, SSN);

    await this.vaidateUserRoles(isTeacher, isAdminOfficer, isPrincipal);

    const user = await this.findById(userId);

    if (!user.IsTeacher && !user.IsPrincipal && !user.IsAdminOfficer) {
      throw new Error('User is not an internal user');
    }

    if (user.IsTeacher == 1 && isTeacher == false) {
      const hasClass = await this.hasClass(userId);
      if (hasClass) {
        throw new Error('User has associated classes, teacher role cannot be removed');
      }
      const isCoordinator = await this.isCoordinator(userId);
      if (isCoordinator) {
        throw new Error ('User is class coordinator, teacher role cannot be removed');
      }
    }
    if (!user.IsPrincipal && isPrincipal) {
      const otherPrincipal = await this.isThereAlreadyAPrincipal();
      if (otherPrincipal) {
        throw new Error('There is already a principal')
      }
    }
    
    const connection = await this.db.getConnection();

    const selectResult = await connection.query(
      `SELECT COUNT(*) AS count
      FROM Users
      WHERE (SSN = ? OR eMail = ?) AND ID != ?;`,
      [SSN, eMail, userId]
    );

    connection.release();

    if (selectResult[0].count != 0) {
      throw new Error('SSN or eMail already used by other account');
    }


    await this.update(userId, {
      eMail: eMail,
      IsTeacher: isTeacher,
      IsAdminOfficer: isAdminOfficer,
      IsPrincipal: isPrincipal,
      FirstName: firstName,
      LastName: lastName,
      SSN: SSN
    });

    return true;
  } 
  
  async hasChildren(userId) {
    const connection = await this.db.getConnection();
    const hasChildren = await connection.query(
      `SELECT *
      FROM Students 
      WHERE Parent1 = ? OR Parent2 = ?`,
      [userId, userId]
    );
    connection.release();

    if(hasChildren.length){
      return true;
    }
    return false
  }

  async checkIfStillParent(userId) {
    const hasChildren = await this.hasChildren(userId);
    if (!hasChildren) {
      const user = await this.findById(userId);
      if (user.IsTeacher == 1 || user.IsPrincipal == 1 || user.IsAdminOfficer == 1) {
        await this.update(userId, {IsParent: 0});
      } else {
        await this.remove(userId);
      }
    }
  }

  async hasClass(userId) {
    const connection = await this.db.getConnection();
    const hasClass = await connection.query(
      `SELECT *
      FROM TeacherSubjectClassRelation 
      WHERE TeacherId = ?`,
      [userId]
    );
    
    connection.release();

    if(hasClass.length){
      return true;      
    }

    return false;
  }

  async isCoordinator(userId) {
    const connection = await this.db.getConnection();
    const isCoordinator = await connection.query(
      `SELECT *
      FROM Classes 
      WHERE CoordinatorId = ?`,
      [userId]
    );

    connection.release();

    if(isCoordinator.length){
      return true;
    }
    return false;
  }
}

export default new User();

