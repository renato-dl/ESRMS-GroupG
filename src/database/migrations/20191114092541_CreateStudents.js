
exports.up = function(knex) {
  return knex.schema.createTable('Students', function (table) {
    table.string('ID').primary();
    table.string('FirstName', 30).notNullable();
    table.string('LastName', 30).notNullable();
    table.string('SSN', 16).unique().notNullable();
    table.datetime('BirthDate').notNullable();
    table.string('Parent1').notNullable();
    table.string('Parent2').nullable().defaultTo(null);
    table.integer('ClassId').unsigned();
    table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();

    table.foreign('Parent1').references('Users.ID');
    table.foreign('Parent2').references('Users.ID');
    table.foreign('ClassId').references('Classes.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Students');
};
