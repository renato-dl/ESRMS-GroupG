
exports.up = function(knex) {
  return knex.schema.table('Users', function(table){
    table.boolean('IsNew').defaultTo(true).notNullable();
  });
  
};

exports.down = function(knex) {
  return knex.schema.table('Users', function(table){
    table.dropColumn('IsNew');
  });
};
