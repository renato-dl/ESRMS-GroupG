
exports.up = function(knex) {
  return knex.schema.table('Students', function(table){
    table.integer('ClassId').alter().unsigned();
  });
};

exports.down = function(knex) {
  return knex.schema.table('Students', function(table){
    table.integer('ClassId').alter().unsigned().notNullable();
  });
};
