
exports.up = function(knex) {
    return knex.schema.createTable('Users', function (table) {
      table.string('ID', 50).primary();
      table.string('eMail', 30).notNullable();
      table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();
      table.string('Password', 50).notNullable();
      table.enu('Role', ['principal', 'admin', 'teacher', 'parent']);
    })  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Users');  
};
