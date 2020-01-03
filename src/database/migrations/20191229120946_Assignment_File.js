
exports.up = function(knex) {
  return knex.schema.createTable('Assignment_File', function (table) {
    table.increments('ID').unsigned().primary();
    table.integer('AssignmentId').unsigned().notNullable();
    table.integer('FileId').unsigned().notNullable();

    table.foreign('AssignmentId').references('Assignments.ID').onDelete('cascade');
    table.foreign('FileId').references('Files.ID').onDelete('cascade');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Assignment_File');
};
