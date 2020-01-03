
exports.up = function(knex) {
  return knex.schema.createTable('Files', function (table) {
    table.increments('ID').unsigned().primary();
    table.string('Key', 1024).notNullable();
    table.string('Name', 255).notNullable();
    table.string('Type').notNullable();
    table.integer('Size').unsigned().notNullable();
    table.timestamp('CreatedOn').defaultTo(knex.fn.now()).notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Files');
};
