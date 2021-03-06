
exports.up = function(knex) {
  return knex.schema.createTable('Classes', function (table) {
    table.increments('ID').unsigned().primary();
    table.integer('CreationYear', 4).unsigned().notNullable();
    table.string('Name', 1).notNullable();
    table.string('CoordinatorId').notNullable();

    table.foreign('CoordinatorId').references('Users.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Classes');
};
