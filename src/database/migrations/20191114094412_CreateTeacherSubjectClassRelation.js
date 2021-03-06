
exports.up = function(knex) {
  return knex.schema.createTable('TeacherSubjectClassRelation', function (table) {
    table.increments('ID').unsigned().primary();
    table.integer('SubjectId').unsigned().notNullable();
    table.integer('ClassId').unsigned().notNullable();
    table.string('TeacherId').notNullable();

    table.unique(['SubjectId', 'ClassId', 'TeacherId']);
    table.unique(['SubjectId', 'ClassId']);
    table.foreign('SubjectId').references('Subjects.ID');
    table.foreign('ClassId').references('Classes.ID');
    table.foreign('TeacherId').references('Users.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('TeacherSubjectClassRelation');
};
