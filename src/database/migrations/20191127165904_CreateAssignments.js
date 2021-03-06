
exports.up = function(knex) {
  return knex.schema.createTable('Assignments', function (table) {
      table.increments('ID').unsigned().primary();
      table.integer('SubjectId').unsigned().notNullable();
      table.integer('ClassId').unsigned().notNullable();
      table.text('Title').notNullable();
      table.text('Description').notNullable();
      table.datetime('DueDate').notNullable();
      table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();
      table.text('AttachmentFile');

      table.foreign('SubjectId').references('Subjects.ID');
      table.foreign('ClassId').references('Classes.ID');
    })
  };

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Assignments');
};
