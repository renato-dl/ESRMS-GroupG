
exports.up = function(knex) {
  return knex.schema.createTable('Students', function (table) {
    table.string('ID', 50).primary();
    table.string('FirstName', 30).notNullable();
    table.string('LastName', 30).notNullable();
    table.string('SSN', 16).unique().notNullable();
    table.date('BirthDate').notNullable();
    table.string('Parent1', 50).notNullable();
    table.string('Parent2', 50).nullable().defaultTo(null);
    table.integer('ClassId').unsigned().notNullable();
    table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();

    table.foreign('Parent1').references('Parents.ID');
    table.foreign('Parent2').references('Parents.ID');
    table.foreign('ClassId').references('Classes.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Students');
};
