
exports.up = function(knex) {
  return knex.schema.createTable('StudentAttendance', function (table) {
    table.increments('ID').unsigned().primary();
    table.string('StudentId').notNullable();
    table.datetime('Date').notNullable();
    table.enu('LateEntry', ['1h', '2h']);
    table.string('EntryTeacherId').notNullable();
    table.time('EarlyExit');
    table.string('ExitTeacherId');

    table.unique(['StudentId', 'Date']);
    table.foreign('StudentId').references('Students.ID');
    table.foreign('EntryTeacherId').references('Users.ID');
    table.foreign('ExitTeacherId').references('Users.ID');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('StudentAttendance');
};
