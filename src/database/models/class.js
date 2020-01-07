import {Model} from './base';
import moment from 'moment';
import User from './user';

class Class extends Model {
  constructor() {
    super('Classes');
  }

  async getClassNameById(classId) {
    
    const classObj = await this.findById(classId);
    
    const today = moment();
    const creation = moment().year(classObj.CreationYear).month(8).date(1);

    let otherDate = creation.clone().add(1, 'years');
    let year = 1;
    while (year < 5 && !today.isBefore(otherDate, 'day')) {
      year++;
      otherDate.add(1, 'years');
      
    }      
    const className = year + classObj["Name"];
    return className;
    
        
  }

  async getClasses(pagination) {
    let query = `
      SELECT C.ID, C.CreationYear, C.Name, CONCAT_WS(' ', U.FirstName, U.LastName) as Coordinator
      FROM Classes C, Users U
      WHERE C.CoordinatorId = U.ID
    `;

    const connection = await this.db.getConnection();

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query);
    connection.release();

    await Promise.all(results.map(async element =>{
      const name = await this.getClassNameById(element.ID);
      let newElement = element;
      newElement.Name = name;
      return newElement;
    }));

    return results || [];
  }
  
  async assignStudentsToClass(classID, students) {
    const studentsIDs = students.map((s) => "'" + s + "'").join(',');
    const query = `
      UPDATE Students
      SET ClassId = ?
      WHERE ID IN (${studentsIDs})
    `;

    const res = {};
    const connection = await this.db.getConnection();
    const results = await connection.query(query, [classID]);
    
    connection.release();

    if (!results.affectedRows) {
      res["Success"] = false;
      res["Message"] = "Something went wrong."; 
    } else {
      res["Success"] = true;
      res["Message"] = "Students associated successfully."; 
    }

    return res;
  }

  async createClass(coordinatorId) {

    if (!coordinatorId) {
      throw new Error('Missing or invalid coordinatorId');
    }

    const isTeacher = await User.isValidTeacher(coordinatorId);

    if (!isTeacher) {
      throw new Error('Coordinator is not a valid teacher');
    }

    const isAlreadyCoordinator = await User.isCoordinator(coordinatorId);

    if (isAlreadyCoordinator) {
      throw new Error('Selected teacher is already a class coordinator');
    }

    const classes = await this.findAll();
    const letter = String.fromCharCode(classes.length + 65);
    const id = await this.create({
      CreationYear: moment().year(),
      Name: letter,
      CoordinatorId: coordinatorId
    });
    return {id: id};
  }

  async isLastClass(classId) {
    const connection = await this.db.getConnection();
    const res = await connection.query(
      `SELECT COUNT(*) AS count
      FROM ${this.tableName}
      WHERE ID = ? AND Name IN (
        SELECT MAX(Name)
        FROM ${this.tableName}
      )`,
      [classId]
    );
    connection.release();
    if (res[0].count != 1) {
      return false;
    }
    return true;
  }

  async hasStudents(classId) {
    const connection = await this.db.getConnection();
    const res = await connection.query(
      `SELECT COUNT(*) AS count
      FROM Students
      WHERE ClassId = ?`,
      [classId]
    );
    connection.release();
    if (res[0].count != 0) {
      return true;
    }
    return false;
  }

  async deleteClass(classId) {
    if (!classId) {
      throw new Error('Missing classId');
    }
    this.findById(classId);
    const hasStudents = await this.hasStudents(classId);
    if (hasStudents) {
      throw new Error('Cannot delete a class with students');
    }
    const isLastClass = await this.isLastClass(classId);
    if (!isLastClass) {
      throw new Error('Only the most recently created class can be deleted');
    }
    await this.remove(classId);
    return true;

  }
}

export default new Class();