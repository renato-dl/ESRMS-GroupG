import {Model} from './base';
import File from './File';

class SupportMaterial extends Model {
  constructor() {
    super('Support_Material');
  }

  async add(subjectID, file) {
    if (!subjectID) {
      throw new Error('Subject is required');
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

    return this.create({ SubjectId: subjectID, FileId: fileID });
  }

  async remove(supportMaterialID) {
    if (!supportMaterialID) {
      throw new Error('Missing or invalid support material');
    }

    const supportMaterial = await this.findById(supportMaterialID);
    if (!supportMaterial) {
      throw new Error('Missing or invalid support material');
    }

    await File.remove(supportMaterial.FileId);
  }

  async findAllByTeacher(
    teacherId,
    filters = { subject, from, to },
    pagination = { page, pageSize }
  ) {
    const connection = await this.db.getConnection();
    let query = `
      SELECT SP.ID, SP.CreatedOn, S.Name as Subject, F.Name, F.Type, F.Size
      FROM Support_Material SP
      INNER JOIN Files F ON F.ID = SP.FileId
      INNER JOIN Subjects S ON S.ID = SP.SubjectId
      INNER JOIN USERS U ON U.ID = ?
      WHERE U.IsTeacher = true
      ${filters && filters.subject ? 'AND S.NAME = ?' : ''}
      ${filters.from && filters.to ? 'AND SP.CreatedOn >= ? AND SP.CreatedOn <= ?' : ''}
      ORDER BY SP.CreatedOn DESC
    `;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }

    connection.release();
    
    return await connection.query(query, [teacherId, ...Object.values(filters).filter((i) => !!i)]);
  }
}

export default new SupportMaterial();
