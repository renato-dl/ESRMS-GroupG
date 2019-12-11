
exports.up = function(knex) {
  return knex.schema.createTable('Communications', function (table) {
      table.increments('ID').unsigned().primary();
      table.string('Title', 255).notNullable();
      table.text('Description').notNullable();
      table.boolean('IsImportant').defaultTo(false).notNullable();
      table.datetime('DueDate').notNullable();
      table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();
    })
  };

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Assignments');
};
