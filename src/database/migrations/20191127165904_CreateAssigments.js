
exports.up = function(knex) {
  return knex.schema.createTable('Assigments', function (table) {
      table.increments('ID').unsigned().primary();
      table.integer('SubjectId').unsigned().notNullable();
      table.integer('ClassId').unsigned().notNullable();
      table.text('Title').notNullable();
      table.text('Description').notNullable();
      table.timestamp('DueDate').notNullable();
      table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();

      table.foreign('SubjectId').references('Subjects.ID');
      table.foreign('ClassId').references('Classes.ID');
    })
  };

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Assignments');
};
