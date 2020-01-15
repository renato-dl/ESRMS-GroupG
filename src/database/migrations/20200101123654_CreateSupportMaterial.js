
exports.up = function(knex) {
  return knex.schema.createTable('Support_Material', function (table) {
    table.increments('ID').unsigned().primary();
    table.integer('TeacherSubjectClassRelationId').unsigned().notNullable();
    table.integer('FileId').unsigned().notNullable();
    table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();

    table.foreign('TeacherSubjectClassRelationId').references('TeacherSubjectClassRelation.ID');
    table.foreign('FileId').references('Files.ID').onDelete('cascade');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Support_Material');
};
