
exports.up = function(knex) {
  return knex.schema.createTable('Parents', function (table) {
    table.string('ID', 50).primary();
    table.string('FirstName', 30).notNullable();
    table.string('LastName', 30).notNullable();
    table.string('eMail', 30).notNullable();
    table.string('SSN', 16).unique().notNullable();
    table.string('Password', 50).notNullable();
    table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Parents');
};