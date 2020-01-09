
exports.up = function(knex) {
  return knex.schema.createTable('Timetable', function(table) {
    table.increments('ID').unsigned().primary();
    table.enu('Day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).notNullable();
    table.enu('Hour', [8, 9, 10, 11, 12, 13]).notNullable();
    table.integer('SubjectId').unsigned().notNullable();
    table.integer('ClassId').unsigned().notNullable();

    table.unique(['Day', 'Hour', 'ClassId']);

    table.foreign('SubjectId').references('Subjects.ID');
    table.foreign('ClassId').references('Classes.ID');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Timetable');
};
