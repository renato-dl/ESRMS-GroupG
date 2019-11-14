
exports.up = function(knex) {
  return knex.schema.createTable('Subjects', function (table) {
    table.increments('ID').unsigned().primary();
    table.string('Name', 30).notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Subjects');
};
