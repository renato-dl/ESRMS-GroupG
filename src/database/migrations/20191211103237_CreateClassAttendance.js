
exports.up = function(knex) {
  return knex.schema.createTable('ClassAttendance', function (table) {
    table.increments('ID').unsigned().primary();
    table.integer('ClassId').unsigned().notNullable();
    table.datetime('Date').notNullable();

    table.unique(['ClassId', 'Date']);
    table.foreign('ClassId').references('Classes.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ClassAttendance');
};
