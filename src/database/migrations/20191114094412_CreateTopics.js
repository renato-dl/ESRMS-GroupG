
exports.up = function(knex) {
  return knex.schema.createTable('Topics', function (table) {
    table.integer('SubjectId').unsigned().notNullable();
    table.integer('ClassId').unsigned().notNullable();
    table.text('Title').notNullable();
    table.text('TopicDescription').notNullable();
    table.date('TopicDate').notNullable();
    table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();

    table.foreign('SubjectId').references('Subjects.ID');
    table.foreign('ClassId').references('TeacherSubjectClassRelation.ClassId');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Topics');
};
