import {Model} from './base';
import moment from 'moment';
import File from './file';
import {
  xorBy, 
  intersectionBy, 
  groupBy,
  pick
} from 'lodash';

class Assignment extends Model {
  constructor() {
    super('Assignments');
  }

  async findByStudentId(studentId, dateRange, pagination) {
    if (!studentId) throw new Error('Missing or invalid student id');
    
    const connection = await this.db.getConnection();
    let query = `
      SELECT A.ID, SU.Name, A.Title, A.Description, A.DueDate, F.Key, F.Name As FileName, F.Size, F.Type 
      FROM Assignments A
      LEFT JOIN Students ST ON A.ClassId = ST.ClassId
      LEFT JOIN Subjects SU ON A.SubjectId = SU.ID
      LEFT JOIN Assignment_File AF ON AF.AssignmentId = A.ID 
      LEFT JOIN Files F ON AF.FileId = F.ID
      WHERE ST.ID = ?
      ${dateRange.from && dateRange.to ? 'AND A.DueDate >= ? AND A.DueDate <= ?' : ''}
      ORDER BY A.DueDate
    `;
    
    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query,  [studentId, dateRange.from, dateRange.to]);

    connection.release();

    if (!results.length) {
      throw new Error('There are no assignments for the chosen student!');
    }

    const grouppedResults = groupBy(results, 'ID');
    const data = Object.keys(grouppedResults).map((key) => {
      const item = pick(grouppedResults[key][0], ['ID', 'Name', 'Title', 'Description', 'DueDate']);
      item.files = [];
      
      if (grouppedResults[key].length > 1) {
        item.files = grouppedResults[key].map((file) => {
          const obj = pick(file, ['Key', 'FileName', 'Size', 'Type'])
          obj.Name = obj.FileName;
          return obj;
        });
      } else if (grouppedResults[key][0].Key) {
        const obj = pick(grouppedResults[key][0], ['Key', 'FileName', 'Size', 'Type']);
        obj.Name = obj.FileName;
        item.files = [obj];
      }

      return item;
    });

    return data;
  }

  async addAssignment(subjectId, classId, title, description, dueDate) {

    if (!subjectId) {
      throw new Error('Missing or invalid subject id');
    }

    if (!classId) {
      throw new Error('Missing or invalid class id');
    }
    
    if (!title) {
      throw new Error('Missing or invalid title');
    }

    if (!description) {
      throw new Error('Missing or invalid description');
    }

    if (!dueDate) {
      throw new Error('Missing or invalid due date');
    }

    const date = moment.utc(dueDate);
    const dayOfWeek = moment.utc(dueDate).isoWeekday();

    if (!date.isValid() || dayOfWeek == 7) {
      throw new Error('Invalid assignment date');
    }

    if (!date.isAfter(moment().utc(), 'day')) {
      throw new Error('Invalid assignment due date');
    }

    const result = await this.create({
      SubjectId: subjectId,
      ClassId: classId,
      Title: title,
      Description: description,
      DueDate: date.format(this.db.getDateFormatString())
    });

    return {
      id: result
    }

  }

  updateAssignment(assId, title, description, dueDate) {
    if (!assId) {
      throw new Error('Missing or invalid assignment id');
    }
    if (!title) {
      throw new Error('Missing or invalid title');
    }
    if (!description) {
      throw new Error('Missing or invalid description');
    }
    if(!dueDate){
      throw new Error('Missing or invalid due date');
    }

    const date = moment.utc(dueDate);
    const dayOfWeek = moment.utc(dueDate).isoWeekday();

    if (!date.isValid() || dayOfWeek == 7) {
      throw new Error('Invalid assignment due date');
    }

    if (!date.isAfter(moment().utc(), 'day')) {
      throw new Error('Invalid assignment due date');
    }

    return this.update(assId, {
      Title: title,
      Description: description,
      DueDate: date.format(this.db.getDateFormatString())
    })
  }

  async findByClassAndSubject(classId, subjectId, dateRange, pagination) {
    if (!classId) throw new Error('Missing or invalid class id');
    if (!subjectId) throw new Error('Missing or invalid subject id');
    
    const connection = await this.db.getConnection();
    let query = `
      SELECT A.ID, A.Title, A.Description, A.DueDate, F.Key, F.Name, F.Size, F.Type 
      FROM Assignments A
      LEFT JOIN Assignment_File AF ON AF.AssignmentId = A.ID 
      LEFT JOIN Files F ON AF.FileId = F.ID
      WHERE A.ClassId = ? AND A.SubjectId = ?
      ${dateRange.from && dateRange.to ? 'AND A.DueDate >= ? AND A.DueDate <= ?' : ''}
      ORDER BY A.DueDate
    `;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    const results = await connection.query(query,  [classId, subjectId, dateRange.from, dateRange.to]);
    connection.release();

    if (!results.length) {
      return [];
    }

    const grouppedResults = groupBy(results, 'ID');
    const data = Object.keys(grouppedResults).map((key) => {
      const item = pick(grouppedResults[key][0], ['ID', 'Title', 'Description', 'DueDate']);
      item.files = [];

      if (grouppedResults[key].length > 1) {
        item.files = grouppedResults[key].map((file) => {
          return pick(file, ['Key', 'Name', 'Size', 'Type']);
        });
      } else if (grouppedResults[key][0].Key) {
        item.files = [pick(grouppedResults[key][0], ['Key', 'Name', 'Size', 'Type'])]
      }

      return item;
    });

    return data;
  }

  async checkIfAssignmentIsFromTeacher(assId, teacherId) {
    if (!assId) throw new Error('Missing or invalid assignment id');
    if (!teacherId) throw new Error('Missing or invalid teacher id');

    const connenction = await this.db.getConnection();
    const result = await connenction.query(
      `SELECT COUNT(*) AS count
      FROM Assignments A, TeacherSubjectClassRelation tscr
      WHERE A.ClassId = tscr.ClassId
      AND tscr.SubjectId = A.SubjectId
      AND tscr.TeacherId = ? AND A.ID = ?`,
      [teacherId, assId]
    );
    connenction.release();
    if (result[0].count == 1) {
      return true;
    }
    return false;
  }

  async getAttachments(assId) {
    if (!assId) throw new Error('Missing or invalid assignment id');
    
    const connection = await this.db.getConnection();
    const files = await connection.query(`
      SELECT F.ID, F.Key 
      FROM Assignment_File AF
      INNER JOIN Files F
      ON F.ID = AF.FileId
      WHERE AssignmentId = ?
    `, [assId]);
    connection.release();
  
    return files;
  }

  async addAttachments(assId, fileIds) {
    if (!assId) throw new Error('Missing or invalid assignment id');
    if (!fileIds) throw new Error('Missing or invalid files');
    if (!Array.isArray(fileIds)) throw new Error('Files must be an array');

    let sql = `INSERT INTO Assignment_File (AssignmentId, FileId) VALUES`;

    const connection = await this.db.getConnection();

    let values = '';
    fileIds.forEach((id, index) => {
      values += index === fileIds.length - 1 ? `(${assId}, ${id})` : `(${assId}, ${id}),`;
    });

    sql += values;
    const result = await connection.query(sql);
    connection.release();

    return !!result.affectedRows;
  }

  async updateAttachments(assId, updatedAttachments) {
    if (!assId) throw new Error('Missing or invalid assignment id');
    if (!updatedAttachments) throw new Error('Missing or invalid files');
    if (!Array.isArray(updatedAttachments)) throw new Error('Files must be an array');
    
    const currentFiles = await this.getAttachments(assId);
    
    if (!updatedAttachments.length) {
      if (currentFiles.length) {
        await File.removeMany(currentFiles.map((f) => f.ID));
      }
    } else {
      const filesToCheck = xorBy(updatedAttachments, currentFiles, 'Key');
      const filesToRemove = intersectionBy(currentFiles, filesToCheck, 'Key');

      if (filesToRemove.length) {
        await File.removeMany(filesToRemove.map((f) => f.ID));
      }
    }
  }

  async findOneByfile(fileID) {
    if (!fileID) throw new Error('Missing or invalid file id');
    
    const connection = await this.db.getConnection();
    const assignment = await connection.query(`
      SELECT A.* 
      FROM Assignment_File AF
      INNER JOIN Files F ON F.ID = AF.FileId
      INNER JOIN Assignments A ON A.ID = AF.AssignmentId
      WHERE AF.FileId = ?
    `, [fileID]);
    connection.release();
  
    return assignment[0];
  }
}

export default new Assignment();
