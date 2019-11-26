
exports.up = function(knex) {
  return knex.schema.table('Grades', function(table){
      table.enu('Type', ['Written', 'Oral']).notNullable();
  });
};

exports.down = function(knex) {
    return knex.schema.table('Grades', function(table){
        table.dropColumn('Type');
    });
};
