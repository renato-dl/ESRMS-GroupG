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

    const result = await this.findBySSN(SSN);

    if (result.length != 0) {
      throw new Error('There is already a student with the specified SSN');
    }

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

    const SSNresult = await this.findBySSN(SSN);

    if (SSNresult.length != 0 && SSNresult[0].ID != studentId) {
      throw new Error('There is already a student with the specified SSN');
    }

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
    if (!firstName || !validator.matches(firstName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
      throw new Error('Missing or invalid first name');
    }
    if (!lastName || !validator.matches(lastName,'^[a-zA-Z]+( [a-zA-Z]+)*$')) {
      throw new Error('Missing or invalid last name');
    }
    if (!SSN || !validateSSN(SSN)) {
      throw new Error('Missing or invalid SSN');
    }
    if (!gender || (gender != 'M' && gender != 'F')) {
      throw new Error('Missing or invalid gender');
    }

    if(!birthDate){
      throw new Error('Missing or invalid birth date');
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

  async getStudentsDataByClassId(classId, pagination){
    if(!classId){
      throw new Error('Invalid class id parameters!');
    }
    
    const connection = await this.db.getConnection();
    let query = `SELECT ID, FirstName, LastName, Gender
    FROM Students
    WHERE ClassId = ?
    ORDER BY LastName`;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query, [classId]);    
    connection.release();

    return results;
  }

  async getStudentsDataByClassIdAndSubjectId(teacherId, classId, subjectId, pagination) {
    if(!teacherId || !classId || !subjectId) {
      throw new Error('Invalid parameters!');
    }
    
    const connection = await this.db.getConnection();
    let query = `
      SELECT s.ID, s.FirstName, s.LastName, s.Gender
      FROM TeacherSubjectClassRelation tscr, Students s
      WHERE s.ClassId = ?
      AND tscr.ClassId = ?
      AND tscr.TeacherId = ?
      AND tscr.SubjectId = ?
    `;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query, [classId, classId, teacherId, subjectId]);    
    connection.release();

    return results || [];
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

    return results;
  }

  async getStudentsWithParentsData(pagination){
    // Get all students
    const students = await this.findAll(pagination);

    // Sort results alphabetically (LastName + FirstName)
    students.sort((a, b) =>{
      const nameA = (a.LastName + a.FirstName).toUpperCase();
      var nameB = (b.LastName + b.FirstName).toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });

    // Combine students with their parents
    const result = await Promise.all(students.map(async element => {
      // Start from student
      let newElement = {};
      newElement.studentInfo = element;

      // Add parent 1 data
      const parent1 = await User.getParentById(element.Parent1);
      newElement.firstParent = parent1[0];

      // Add parent 2 data if available
      if(element.Parent2){
        const parent2 = await User.getParentById(element.Parent2);
        newElement.secondParent = parent2[0];
      }
      
      // Remove redundant information
      delete newElement.studentInfo['Parent1'];
      delete newElement.studentInfo['Parent2'];
      return newElement;
    }));

    
    return result;
  }

  async checkIfRelated(studentId, parentId) {
    if(!studentId){
      throw new Error("Missing or invalid studentId");
    }
    if(!parentId){
      throw new Error("Missing or invalid parentId");
    }
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

  async findBySSN(SSN) {
    if(!SSN){
      throw new Error("Missing or invalid SSN");
    }
    const connection = await this.db.getConnection();
    const result = await connection.query(`
      SELECT *
      FROM ${this.tableName}
      WHERE SSN = ?
    `, [SSN]);
    connection.release();
    return result;
  }

  async findByClassId(classId) {
    if (!classId) {
      throw new Error('Missing or invalid classId')
    }
    const connection = await this.db.getConnection();
    let result
    try {
      result = await connection.query(`
        SELECT ID AS StudentId, FirstName, LastName
        FROM ${this.tableName}
        WHERE ClassId = ?
        ORDER BY LastName, FirstName
      `, [classId]);}
    catch(error) {
      console.log(error);
    } finally {
      connection.release();
    }
    return result;
  }
}

export default new Student();