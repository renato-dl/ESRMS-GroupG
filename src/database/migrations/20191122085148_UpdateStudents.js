
exports.up = function(knex) {
  return knex.schema.table('Students', function (table) {
    table.enu('Gender', ['M', 'F']).notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.table('Students', function (table) {
    table.dropColumn('Gender');
  })
};
