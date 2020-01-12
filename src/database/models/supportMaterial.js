import {Model} from './base';
import File from './file';
import TeacherSubjectClassRelation from './teacherClassSubject';

class SupportMaterial extends Model {
  constructor() {
    super('Support_Material');
  }

  async add(teacherID, subjectID, classID, file) { 
    if (!subjectID) {
      throw new Error('Teacher id is required');
    }

    if (!subjectID) {
      throw new Error('Subject id is required');
    }
    
    if (!classID) {
      throw new Error('Class id is required');
    }

    if (!file) {
      throw new Error('File is required');
    }

    const fileID = await File.create({
      Key: file.filename,
      Name: file.originalname,
      Size: file.size,
      Type: file.mimetype
    });

    const connection = await this.db.getConnection();
    const selectResult = await connection.query(
      `SELECT ID
        FROM TeacherSubjectClassRelation
        WHERE SubjectId = ? AND TeacherId = ? AND ClassId = ?
      `,
      [subjectID, teacherID, classID]
    );

    const TeacherSubjectClassRelationId = selectResult[0] && selectResult[0].ID;
    if(!TeacherSubjectClassRelationId) {
      await File.remove(fileID);
      connection.release();
      throw new Error('Teacher is not allowed to add support material.');
    }

    return this.create({ TeacherSubjectClassRelationId, FileId: fileID });
  }

  async remove(teacherID, supportMaterialID) {
    if (!teacherID) {
      throw new Error('Missing or invalid teacher');
    }

    if (!supportMaterialID) {
      throw new Error('Missing or invalid support material');
    }

    const supportMaterial = await this.findById(supportMaterialID);
    if (!supportMaterial) {
      throw new Error('Missing or invalid support material');
    }

    const tscr = await TeacherSubjectClassRelation.findById(supportMaterial.TeacherSubjectClassRelationId);
    if (!tscr || tscr.TeacherId !== teacherID) {
      throw new Error('Teacher is not allowed to remove this support material');
    }

    await File.remove(supportMaterial.FileId);
  }

  async findAllByTeacher(
    teacherId,
    filters = { subject: '', classId: '', from: '', to: '' },
    pagination = { page: 0, pageSize: 25 }
  ) {
    if (!teacherId) {
      throw new Error('Missing or invalid teacher id.');
    }

    const connection = await this.db.getConnection();
    let query = `
      SELECT SP.ID, SP.CreatedOn, S.Name as Subject, F.Name, F.Type, F.Size, TSCR.ClassId
      FROM Support_Material SP
      INNER JOIN TeacherSubjectClassRelation TSCR ON TSCR.ID = SP.TeacherSubjectClassRelationId
      INNER JOIN Files F ON F.ID = SP.FileId
      INNER JOIN Subjects S ON S.ID = TSCR.SubjectId
      INNER JOIN Users U ON U.ID = TSCR.TeacherId
      WHERE TSCR.TeacherId = ?
      ${filters && filters.classId ? 'AND TSCR.ClassId = ?' : ''}
      ${filters && filters.subject ? 'AND S.Name = ?' : ''}
      ${filters && filters.from && filters.to ? 'AND SP.CreatedOn >= ? AND SP.CreatedOn <= ?' : ''}
      ORDER BY SP.CreatedOn DESC
    `;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    connection.release();
    return connection.query(query, [teacherId, ...Object.values(filters || {}).filter((i) => !!i)]);
  }

  async findAllByStudent(
    studentId,
    filters = { subject: '', from: '', to: '' },
    pagination = { page: 0, pageSize: 25 }
  ) {
    if (!studentId) {
      throw new Error('Missing or invalid student id.')
    }

    const connection = await this.db.getConnection();
    let query = `
      SELECT SP.ID, SP.CreatedOn, S.ID as SubjectID, S.Name as SubjectName, F.Name, F.Type, F.Size
      FROM Support_Material SP, Files F, Subjects S, TeacherSubjectClassRelation TSCR, Students STU
      WHERE SP.TeacherSubjectClassRelationId = TSCR.ID
      AND F.ID = SP.FileId
      AND TSCR.SubjectId = S.ID
      AND TSCR.ClassId = STU.classId
      AND STU.ID = ?
      ${filters && filters.subject ? 'AND S.ID = ?' : ''}
      ${filters && filters.from && filters.to ? 'AND SP.CreatedOn >= ? AND SP.CreatedOn <= ?' : ''}
      ORDER BY SP.CreatedOn DESC
    `;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    connection.release();
    
    return await connection.query(query, [studentId, ...Object.values(filters || {}).filter((i) => !!i)]);
  }
}

export default new SupportMaterial();
