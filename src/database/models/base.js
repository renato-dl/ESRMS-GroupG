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
    let query = `SELECT * FROM ${this.tableName}`;

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

    let keysSQL = `WHERE ${this.tableName}.${keys[0]} = ?`;
    if (keys.length > 1) {
      keys.slice(1).forEach((key) => {
        keysSQL += ` AND ${this.tableName}.${key} = ?` ;
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
    const attributes = Object.keys(data).map((key) => `${this.tableName}.${key}`).join(',');
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
   * Creates multiple new record in the table
   * returns the new records
   * 
   * @param {array} data 
   * 
   */
  async createMany(data) {
    const connection = await this.db.getConnection();
    const attributes = Object.keys(data[0]).map((key) => `${this.tableName}.${key}`).join(',');
    let sql = `INSERT INTO ${this.tableName} (${attributes}) VALUES`;
    const preparePattern = this.db.getPreparePattern(Object.keys(data[0]).length);
    const values = [];

    let valuesStr = '';
    data.forEach((item, index) => {
      valuesStr += index === data.length - 1 ? `(${preparePattern})` : `(${preparePattern}),`;
      values.push(...Object.values(item));
    })

    sql += valuesStr;

    const result = await connection.query(sql, values);
    connection.release();

    if (!result.affectedRows) {
      throw new Error("Couldn't save entities");
    }

    const firstInsertId = result.insertId;
    const lastInsertId = result.affectedRows + result.insertId - 1;
    const entityIds = [];

    for(let i = firstInsertId; i <= lastInsertId; i++) {
      entityIds.push(i);
    }

    return entityIds;
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
    try {
      await connection.query(`DELETE FROM ${this.tableName} WHERE ID = ?`, [id]);
    } finally {
      connection.release();
    }
  }

  /**
   * Removes many record from the table
   * 
   * @param {Array<number|string>} ids 
   */
  async removeMany(ids) {
    const connection = await this.db.getConnection();
    await connection.query(`DELETE FROM ${this.tableName} WHERE ID IN (${ids})`);
    connection.release();
  }
  
}