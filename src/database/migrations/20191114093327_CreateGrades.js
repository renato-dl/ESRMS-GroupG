
exports.up = function(knex) {
  return knex.schema.createTable('Grades', function (table) {
    table.increments('ID').unsigned().primary();
    table.integer('SubjectId').unsigned().notNullable();
    table.string('StudentId').notNullable();
    table.decimal('Grade', 10, 2).notNullable();
    table.timestamp('GradeDate').notNullable();

    table.foreign('SubjectId').references('Subjects.ID');
    table.foreign('StudentId').references('Students.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Grades');
};
