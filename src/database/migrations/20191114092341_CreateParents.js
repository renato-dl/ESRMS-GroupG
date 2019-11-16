
exports.up = function(knex) {
  return knex.schema.createTable('Parents', function (table) {
    table.string('ID', 50).primary();
    table.string('FirstName', 30).notNullable();
    table.string('LastName', 30).notNullable();
    table.string('SSN', 16).unique().notNullable();
    table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();

    table.foreign('ID').references('Users.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Parents');
};
