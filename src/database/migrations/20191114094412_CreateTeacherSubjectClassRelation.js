
exports.up = function(knex) {
  return knex.schema.createTable('TeacherSubjectClassRelation', function (table) {
    table.integer('SubjectId').unsigned().notNullable();
    table.integer('ClassId').unsigned().notNullable();
    table.string('TeacherId', 50).notNullable();

    table.primary(['SubjectId', 'ClassId', 'TeacherId']);
    table.foreign('SubjectId').references('Subjects.ID');
    table.foreign('ClassId').references('Classes.ID');
    table.foreign('TeacherId').references('Teachers.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('TeacherSubjectClassRelation');
};
