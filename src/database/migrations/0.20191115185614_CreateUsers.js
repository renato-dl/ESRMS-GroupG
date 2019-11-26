
exports.up = function(knex) {
    return knex.schema.createTable('Users', function (table) {
      table.string('ID').primary();
      table.string('eMail', 30).notNullable();
      table.string('Password').notNullable();
      table.enu('Role', ['principal', 'admin', 'teacher', 'parent']).notNullable();
      table.string('FirstName', 30).notNullable();
      table.string('LastName', 30).notNullable();
      table.string('SSN', 16).unique().notNullable();
      table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();
    })  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Users');  
};
