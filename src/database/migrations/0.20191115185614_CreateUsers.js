
exports.up = function(knex) {
    return knex.schema.createTable('Users', function (table) {
      table.string('ID').primary();
      table.string('eMail', 30).notNullable();
      table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();
      table.string('Password').notNullable();
      table.enu('Role', ['principal', 'admin', 'teacher', 'parent']).notNullable();
    })  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Users');  
};
