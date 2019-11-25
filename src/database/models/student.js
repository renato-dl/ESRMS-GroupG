import {Model} from './base';
import validator from 'validator';
import {validateSSN} from '../../services/ssnValidator';
import User from './user';
import uuid from 'uuid/v4';

class Student extends Model {
  constructor() {
    super('Students');
    this.columns = 'ID, FirstName, LastName, Gender, SSN, BirthDate';
  }
  
  async findByParentId(parentId) {
    const connection = await this.db.getConnection();
    const results = await connection.query(
        `SELECT ${this.columns}
        FROM ${this.tableName}
        WHERE Parent1 = ? OR Parent2 = ?`,
        [parentId, parentId]
    );
    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }

    return results;
  }

  async insertStudent(firstName, lastName, SSN, gender, birthDate, parent1, parent2) {
    
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
    if (gender != 'M' || gender != 'F') {
      throw new Error('Missing or invalid gender');
    }

    const date = moment.utc(birthDate);
    if (!date.isValid()) {
      throw new Error('Invalid topic date');
    }

    if (!parent1) {
      throw new Error('Missing or invalid parent1 id');
    }
    if (!await User.isValidParent(parent1)) {
      throw new Error('Invalid parent1 id');
    }

    if (parent2 && !await User.isValidParent(parent2)) {
      throw new Error('Invalid parent2 id');
    } else {
      parent2 = null;
    }

    const id = uuid();

    try {
      
      const insertResult = await connection.query(
        `INSERT INTO Students(ID, FirstName, LastName, SSN, BirthDate, Parent1, Parent2, Gender)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [id, firstName, lastName, SSN, birthDate.format(this.db.getDateTimeFormatString()), parent1, parent2, gender]
      );
      connection.release();

      if (insertResult.affectedRows != 1) {
        throw new Error('Something went wrong')
      } else {
        return {
          id: id
        }
      }

    } catch(err) {
      connection.release();
      console.log(err.message);
      throw(err);
    }
    

    

  }
}

export default new Student();