
exports.up = function(knex) {
  return knex.schema.createTable('Topics', function (table) {
    table.increments('ID').unsigned().primary();
    table.integer('TeacherSubjectClassRelationId').unsigned().notNullable();
    table.text('Title').notNullable();
    table.text('TopicDescription').notNullable();
    table.datetime('TopicDate').notNullable();
    table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();

    table.foreign('TeacherSubjectClassRelationId').references('TeacherSubjectClassRelation.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Topics');
};
