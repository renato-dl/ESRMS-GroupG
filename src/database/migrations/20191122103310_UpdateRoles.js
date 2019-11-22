
exports.up = function(knex) {
  return knex.schema.table('Users', function(table){
    table.dropColumn('Role');
    table.boolean('IsAdminOfficer').defaultTo(false).notNullable();
    table.boolean('IsSysAdmin').defaultTo(false).notNullable();
    table.boolean('IsParent').defaultTo(false).notNullable();
    table.boolean('IsTeacher').defaultTo(false).notNullable();
    table.boolean('IsPrincipal').defaultTo(false).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('Users', function(table){
    table.dropColumn('IsAdminOfficer');
    table.dropColumn('IsSysAdmin');
    table.dropColumn('IsParent');
    table.dropColumn('IsTeacher');
    table.dropColumn('IsPrincipal');
    table.enu('Role', ['principal', 'admin', 'teacher', 'parent']).notNullable();
  });
};
