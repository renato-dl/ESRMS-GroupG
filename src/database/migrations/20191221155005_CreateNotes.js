
exports.up = function(knex) {
  return knex.schema.createTable('Notes', function (table) {
      table.increments('ID').unsigned().primary();
      table.string('Title', 255).notNullable();
      table.text('Description').notNullable();
      table.string('StudentId').notNullable();
      table.string('TeacherId').notNullable();
      table.boolean('IsSeen').defaultTo(false).notNullable();
      table.datetime('Date').notNullable();
      table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();

      table.foreign('StudentId').references('Students.ID');
      table.foreign('TeacherId').references('Users.ID');
      
    })
  };

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Notes');
};

