
exports.up = function(knex) {
  return knex.schema.table('Users', function(table){
    table.dropColumn('Role');
    table.boolean('IsAdmin').defaultTo(false).notNullable();
    table.boolean('IsParent').defaultTo(false).notNullable();
    table.boolean('IsTeacher').defaultTo(false).notNullable();
    table.boolean('IsPrincipal').defaultTo(false).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('Users', function(table){
    table.dropColumn('IsAdmin');
    table.dropColumn('IsParent');
    table.dropColumn('IsTeacher');
    table.dropColumn('IsPrincipal');
    table.enu('Role', ['principal', 'admin', 'teacher', 'parent']).notNullable();
  });
};
