import {Model} from './base';
import moment from 'moment';

class Communication extends Model {
  constructor() {
    super('Communications');
  }

  validateFields(title, description) {
    if (!title || !description) {
      throw new Error('Please provide a valid title and description.');
    }

    if (title.length > 255) {
      throw new Error('Invalid title.');
    }
  }

  async findAll() {
    const query = `
      SELECT *, DATEDIFF(DueDate, CURDATE()) AS diff
      FROM ${this.tableName}
      ORDER BY CASE WHEN diff < 0 THEN 1 ELSE 0 END, IsImportant DESC, diff`

      const connection = await this.db.getConnection();
      let result;
      try {
        result = await connection.query(query);
      } catch (error) {
        console.log(error);
      } finally {
        connection.release();
      }      
      return result;
  }

  async add(Title, Description, IsImportant, DueDate) {
    this.validateFields(Title, Description);
    IsImportant = !!IsImportant;
    
    const format = this.db.getDateFormatString();
    DueDate = DueDate ? moment.utc(DueDate).format(format) : moment().utc().format(format);

    const communicationID = await this.create({ Title, Description, IsImportant, DueDate });
    return await this.findById(communicationID);
  }

  async update(id, Title, Description, IsImportant, DueDate) {
    if (!id) {
      throw new Error('Please provide a valid id.');
    }
    
    this.validateFields(Title, Description);
    const format = this.db.getDateFormatString();
    DueDate = DueDate ? moment.utc(DueDate).format(format) : moment.utc(format);

    const updated = await super.update(id, { Title, Description, IsImportant, DueDate });
    
    if (updated) {
      return await super.findById(id);
    }

    return null;
  }

  async remove(id) {
    if (!id) {
      throw new Error('Please provide a valid id.');
    }

    return super.remove(id);
  }
}

export default new Communication();