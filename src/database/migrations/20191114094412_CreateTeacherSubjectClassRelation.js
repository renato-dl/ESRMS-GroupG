
exports.up = function(knex) {
  return knex.schema.createTable('TeacherSubjectClassRelation', function (table) {
    table.increments('ID').unsigned().primary();
    table.integer('SubjectId').unsigned().notNullable();
    table.integer('ClassId').unsigned().notNullable();
    table.string('TeacherId', 50).notNullable();

    table.unique(['SubjectId', 'ClassId', 'TeacherId']);
    table.foreign('SubjectId').references('Subjects.ID');
    table.foreign('ClassId').references('Classes.ID');
    table.foreign('TeacherId').references('Teachers.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('TeacherSubjectClassRelation');
};
