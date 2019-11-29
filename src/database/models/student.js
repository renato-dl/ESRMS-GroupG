import {Model} from './base';
import validator from 'validator';
import {validateSSN} from '../../services/ssnValidator';
import User from './user';
import uuid from 'uuid/v4';
import moment from 'moment';

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
    
    await this.validateStudentData(firstName, lastName, SSN, gender, birthDate, parent1, parent2);

    const id = uuid();

    const date = moment.utc(birthDate);

    await this.create({
      ID: id,
      FirstName: firstName,
      LastName: lastName,
      SSN: SSN,
      BirthDate: date.format(this.db.getDateFormatString()),
      Parent1: parent1,
      Parent2: parent2,
      Gender: gender
    });

    return {
      id: id
    }  

  }

  async updateStudentData(studentId, firstName, lastName, SSN, gender, birthDate, parent1, parent2) {
    
    await this.validateStudentData(firstName, lastName, SSN, gender, birthDate, parent1, parent2);

    const date = moment.utc(birthDate);

    const result = await this.update(studentId, {
      FirstName: firstName,
      LastName: lastName,
      SSN: SSN,
      BirthDate: date.format(this.db.getDateFormatString()),
      Parent1: parent1,
      Parent2: parent2,
      Gender: gender
    });

    return {
      success: result
    }  

  }

  async validateStudentData(firstName, lastName, SSN, gender, birthDate, parent1, parent2) {
    //input data validation
    if (!validator.matches(firstName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
      throw new Error('Missing or invalid first name');
    }
    if (!validator.matches(lastName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
      throw new Error('Missing or invalid last name');
    }
    if (!SSN || !validateSSN(SSN)) {
      throw new Error('Missing or invalid SSN');
    }
    if (gender != 'M' && gender != 'F') {
      throw new Error('Missing or invalid gender');
    }

    const date = moment.utc(birthDate);
    if (!date.isValid()) {
      throw new Error('Invalid birth date');
    }

    if (date.isAfter(moment().utc(), 'day')) {
      throw new Error('Future birth date');
    }

    if (!parent1) {
      throw new Error('Missing or invalid parent1 id');
    }
    if (!await User.isValidParent(parent1)) {
      throw new Error('Invalid parent1 id');
    }

    if (parent2) {
      if (!await User.isValidParent(parent2)) {
        throw new Error('Invalid parent2 id');
      }
    } else {
      parent2 = null;
    }

    if (parent1 == parent2) {
      throw new Error('Parents id must be different');
    }
  }

  async getStudentsData(isAssigned, pagination){
    const connection = await this.db.getConnection();
    let query;

    if(isAssigned){
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
      throw new Error('No students found!');
    }
    return results;
  }

  async getStudentsWithParentsData(pagination){
    const students = await this.findAll(pagination);
    let result = [];
    students.forEach(async element => {
      let newElement = {};
      newElement.studentInfo = element; 
      const parent1 = await User.getParentById(element.Parent1);
      newElement.firstParent = parent1;

      if(element.Parent2){
        const parent2 = await User.getParentById(element.Parent2);
        newElement.secondParent = parent2;
      }
      this.result.push(newElement);
    });
    return result;
  }

  async checkIfRelated(studentId, parentId) {
    const connenction = await this.db.getConnection();
    const result = await connenction.query(
      `SELECT COUNT(*) AS count
      FROM Students
      WHERE ID = ? AND (Parent1 = ? OR Parent2 = ?);`,
      [studentId, parentId, parentId]
    );
    connenction.release();
    if (result[0].count == 1) {
      return true;
    }
    return false;

  }
}

export default new Student();