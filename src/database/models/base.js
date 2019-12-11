import Database from '../';

export class Model {
  constructor(tableName) {
   this.db = Database;
   this.tableName = tableName;
  }

  /**
   * Returns the record by id or fails
   * 
   * @param {number|string} id 
   */
  async findById(id) {
    const connection = await this.db.getConnection();
    const results = await connection.query(`SELECT * FROM ${this.tableName} WHERE ID = ?`, [id]);
    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }

    return results[0];
  }

  /**
   * Returns many records from the table
   * 
   * @param {object} pagination 
   */
  async findAll(pagination) {
    const connection = await this.db.getConnection();
    let query = `SELECT * FROM ${this.tableName} ORDER BY IsImportant DESC, DueDate ASC`;

    if (pagination) {
      query += ` ${this.db.getPaginationQuery(pagination)}`
    }
    
    const result = await connection.query(query);
    connection.release();
    
    return result;
  }

  async findOne(params, select = '*') {
    const connection = await this.db.getConnection();
    const keys = Object.keys(params);
    const values = Object.values(params);

    let keysSQL = `WHERE ${keys[0]} = ?`;
    if (keys.length > 1) {
      keys.slice(1).forEach((key) => {
        keysSQL += ` AND ${key} = ?` ;
      });
    }

    let query = `SELECT ${select} FROM ${this.tableName} ${keysSQL} LIMIT 1`;
    
    const results = await connection.query(query, values);
    connection.release();

    if (!results.length) {
      throw new Error('Entity not found');
    }
    
    return results[0];
  }

  /**
   * Creates a new record in the table
   * return the new record id
   * 
   * @param {object} data 
   * 
   */
  async create(data) {
    const connection = await this.db.getConnection();
    const attributes = Object.keys(data).join(',');
    const values = Object.values(data);
    const preparePattern = this.db.getPreparePattern(values.length);

    const result = await connection.query(
      `INSERT INTO ${this.tableName}(${attributes}) VALUES(${preparePattern})`, 
      values
    );
    connection.release();

    if (!result.affectedRows) {
      throw new Error("Couldn't save entity");
    }

    return result.insertId;
  }

  /**
   * Updates a record in the database
   * returns boolean based on the success of the operation
   * 
   * @param {number|string} id 
   * @param {object} data 
   */
  async update(id, data) {
    const connection = await this.db.getConnection();
    const attributes = Object.keys(data);

    let updateSQL = `UPDATE ${this.tableName} SET ${attributes[0]} = ?`;
    if (attributes.length > 1) {
      attributes.slice(1).forEach((attribute) => {
        updateSQL += `, ${attribute} = ?`
      });
    }

    updateSQL += ` WHERE ID = ?;`;
    
    const result = await connection.query(updateSQL, [...Object.values(data), id]);
    connection.release();

    return !!result.affectedRows;
  }

  /**
   * Removes a record from the table
   * 
   * @param {number|string} id 
   */
  async remove(id) {
    const connection = await this.db.getConnection();
    await connection.query(`DELETE FROM ${this.tableName} WHERE ID = ?`, [id]);
    connection.release();
  }
  
}